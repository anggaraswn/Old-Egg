import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import styles from './Index.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  FaStar,
  FaStarHalfAlt,
  FaAngleLeft,
  FaAngleRight,
} from 'react-icons/fa';

import axios from 'axios';
import Card from '@/components/card';

interface Shop {
  id: string;
  name: string;
  image: string;
  banner: string;
  followers: number;
  salesCount: number;
  policy: string;
  aboutUs: string;
  banned: boolean;
  rating: number;
}

interface Product {
  id: string;
  name: string;
  images: string;
  price: number;
  discount: number;
  rating: number;
  stock: number;
  description: string;
  numberOfReviews: number;
  numberBought: number;
  numberOfRatings: number;
}

export default function ProductsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopProducts, setShopProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [fullStars, setFullStars] = useState(0);
  const [halfStars, setHalfStars] = useState(0);
  const [sortBy, setSortBy] = useState('highestPrice');
  const [currPage, setCurrPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [limit, setLimit] = useState(2);
  const [offset, setOffset] = useState(0);
  const [counts, setCounts] = useState(1);
  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const GET_SHOP_QUERY = `query Shop($id: ID!){
    shop(id: $id){
      name,
    image,
    banner,
    followers,
    salesCount,
    policy,
    aboutUs,
    banned,
    rating,
    products{
      id,
      name,
      images,
      price,
      category{
        id,
        name
      },
    }
    }
  }
  `;
  const SHOP_PRODUCTS_QUERY = `query shopProducts($shopID: ID!, $sortBy: String, $limit: Int, $offset: Int){
    shopProducts(shopID: $shopID, sortBy: $sortBy, limit: $limit, offset: $offset){
      id,
      name,
      images,
      price,
      discount,
      rating,
      stock
    }
  }`;

  useEffect(() => {
    if (id) {
      GRAPHQLAPI.post('', {
        query: GET_SHOP_QUERY,
        variables: {
          id: id,
        },
      })
        .then((response) => {
          console.log(response);
          setShop(response.data.data.shop);
          setShopProducts(response.data.data.shop.products);

          GRAPHQLAPI.post('', {
            query: SHOP_PRODUCTS_QUERY,
            variables: {
              shopID: id,
              sortBy: sortBy,
              limit: limit,
            },
          }).then((response) => {
            console.log(response);
            setProducts(response.data.data.shopProducts);
            // console.log(shopProducts);
            setTotalPage(Math.ceil(shopProducts.length / limit));
            setCurrPage(1);
            setOffset(0);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);

  useEffect(() => {
    setFullStars(Math.floor(shop?.rating));
    setHalfStars(Math.round(shop?.rating - fullStars));
  }, [shop]);

  useEffect(() => {
    if (id) {
      GRAPHQLAPI.post('', {
        query: SHOP_PRODUCTS_QUERY,
        variables: {
          shopID: id,
          sortBy: sortBy,
          limit: limit,
        },
      }).then((response) => {
        console.log(response);
        setProducts(response.data.data.shopProducts);
      });
    }
  }, [sortBy, limit]);

  useEffect(() => {
    if (id) {
      GRAPHQLAPI.post('', {
        query: SHOP_PRODUCTS_QUERY,
        variables: {
          shopID: id,
          sortBy: sortBy,
          limit: limit,
          offset: offset,
        },
      })
        .then((response) => {
          console.log(response);
          setProducts(response.data.data.shopProducts);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [totalPage, offset, sortBy]);

  useEffect(() => {
    console.log('in');
    setOffset((currPage - 1) * limit);
  }, [currPage]);

  const handleAboutUs = () => {
    return '/shop/aboutUs/' + id;
  };

  const handleReviews = () => {
    return '/shop/review/' + id;
  };

  const handleHome = () => {
    return '/shop/' + id;
  };

  const handlePrev = () => {
    if (currPage > 1) setCurrPage(currPage - 1);
  };

  const handleNext = () => {
    if (currPage < totalPage) setCurrPage(currPage + 1);
  };

  return (
    <div className={styles.body}>
      <Navbar />
      {shop?.banned ? (
        <h1 className={styles.banned}>Shop is banned</h1>
      ) : (
        <div>
          <div className={styles.sellerProfileContainer}>
            <div className={styles.sellerHeader}>
              <div className={styles.contentInner}>
                <div className={styles.sellerProfile}>
                  <div className={styles.sellerList}>
                    <div className={styles.avatar}>
                      <img
                        src={shop?.image}
                        alt=""
                        className={styles.profilePic}
                      />
                    </div>
                    <ul className={styles.sellerListInfo}>
                      <li className={styles.sellerHead}>
                        <span>{shop?.name}</span>
                      </li>
                      <li className={styles.sellerData}>
                        <span className={styles.sellerDataSales}>
                          {shop?.salesCount} Sales |&nbsp;
                        </span>
                        <span className={styles.sellerDataFollow}>
                          {shop?.followers} Followers |&nbsp;
                        </span>
                        <span className={styles.sellerDataRating}>
                          {[...Array(fullStars >= 0 ? fullStars : 0)].map(
                            (_, index) => (
                              <FaStar key={index} className={styles.star} />
                            ),
                          )}
                          {[...Array(halfStars >= 0 ? halfStars : 0)].map(
                            (_, index) => (
                              <FaStarHalfAlt
                                key={index}
                                className={styles.star}
                              />
                            ),
                          )}{' '}
                          &nbsp;Ratings |&nbsp;
                        </span>
                      </li>
                      <li className={styles.sellerBtn}>
                        <div className={styles.sellerBtnGroup}>
                          <button>FOLLOW</button>
                          <a href="https://secure.newegg.com/notifications/composesellermessage?SellerID=TMZS304S1U4UEQD27&SellerName=GodLoveMe">
                            CONTACT
                          </a>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.sellerNavTab}>
              <div className={styles.contentInner2}>
                <div className={styles.tab}>
                  <div className={styles.tabCell}>
                    <a href={handleHome()}>Store Home</a>
                  </div>
                  <div className={`${styles['tabCell']} ${styles['curr']}`}>
                    <a href="#">All Products</a>
                  </div>
                  <div className={styles.tabCell}>
                    <a href={handleReviews()}>Reviews</a>
                  </div>
                  <div className={styles.tabCell}>
                    <a href="#">Return Policy</a>
                  </div>
                  <div className={styles.tabCell}>
                    <a href={handleAboutUs()}>About Us</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.pageContentInner}>
            <div className={styles.sortByContainer}>
              <div className={styles.subContainer1}>
                <span>Sort By:</span>
                <select
                  value={sortBy}
                  // className={styles.forminputselection}
                  onChange={(event) => {
                    setSortBy(event.target.value);
                  }}
                  className={styles.selectstyle}
                >
                  <option value="lowestPrice">Lowest Price</option>
                  <option value="highestPrice">Highest Price</option>
                  <option value="topRaint">Top Rating</option>
                  <option value="topBuyed">Top Buyed</option>
                </select>
              </div>
              <div>{limit + '/' + shopProducts.length + ' products'}</div>
              <div className={styles.subContainer2}>
                <div className={styles.changepagecontainer}>
                  {totalPage > 1 ? (
                    <div className={styles.alignCenter}>
                      <button
                        onClick={handlePrev}
                        className={styles.paginationBTN}
                      >
                        <FaAngleLeft />
                      </button>
                      <span>Page</span> {currPage + '/' + totalPage}
                      <button
                        onClick={handleNext}
                        className={styles.paginationBTN}
                      >
                        <FaAngleRight />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <span>Page</span>{' '}
                      <span>{currPage + '/' + totalPage}</span>
                    </div>
                  )}
                </div>
                <div className={styles.paginationcontainer}>
                  <b>View:</b>
                  <select
                    value={limit}
                    className={styles.forminputselection}
                    onChange={(event) => {
                      setLimit(Number(event.target.value));
                    }}
                  >
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                    <option value={shopProducts.length}>All</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.search}></div>
            <div className={styles.productsContainer}>
              {products?.map((s) => {
                return (
                  <Card
                    id={s.id}
                    image={s.images}
                    name={s.name}
                    price={s.price}
                    key={s.id}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
      <FooterMain />
    </div>
  );
}
