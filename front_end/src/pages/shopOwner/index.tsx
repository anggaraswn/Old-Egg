import { getCookie } from 'cookies-next';
import styles from './Index.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  FaStar,
  FaStarHalfAlt,
  FaAngleLeft,
  FaAngleRight,
} from 'react-icons/fa';
import Card from '@/components/card';
import Navbar from '@/components/navbar';
import FooterMain from '@/components/footerMain';

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

export default function ShopOwnerHome() {
  const token = getCookie('jwt');
  const [user, setUser] = useState([]);
  const [shop, setShop] = useState<Shop | null>(null);
  const [shopProducts, setShopProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('highestPrice');
  const [currPage, setCurrPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [limit, setLimit] = useState(2);
  const [offset, setOffset] = useState(0);

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });

  const GET_CURRENT_USER = `query{
    getCurrentUser{
      id,
      firstName,
      lastName,
      email,
      phone,
      password,
      subscribe,
      banned,
      role
    }
  }
  `;

  const GET_SHOP_QUERY = `query shop($userID: ID){
    shop(userID: $userID){
      id,
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
        price
        category{
          id,
          name
        },
      }
    }
  }`;

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
    GRAPHQLAPI.post(
      '',
      {
        query: GET_CURRENT_USER,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      setUser(response.data.data.getCurrentUser);
      GRAPHQLAPI.post('', {
        query: GET_SHOP_QUERY,
        variables: {
          userID: response.data.data.getCurrentUser.id,
        },
      })
        .then((res) => {
          console.log(res);
          setShop(res.data.data.shop);
          setShopProducts(res.data.data.shop.products);

          GRAPHQLAPI.post('', {
            query: SHOP_PRODUCTS_QUERY,
            variables: {
              shopID: res.data.data.shop.id,
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
    });
  }, [token]);

  useEffect(() => {
    if (shop?.id) {
      GRAPHQLAPI.post('', {
        query: SHOP_PRODUCTS_QUERY,
        variables: {
          shopID: shop?.id,
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
    if (shop?.id) {
      GRAPHQLAPI.post('', {
        query: SHOP_PRODUCTS_QUERY,
        variables: {
          shopID: shop?.id,
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

  const handlePrev = () => {
    if (currPage > 1) setCurrPage(currPage - 1);
  };

  const handleNext = () => {
    if (currPage < totalPage) setCurrPage(currPage + 1);
  };

  const handleUpdateAbout = () => {
    window.location.href = '/shopOwner/updateAbout/' + shop?.id;
  };

  const handleUpdateShop = () => {
    window.location.href = '/shopOwner/updateShop/' + shop?.id;
  };

  const handleInsertProduct = () => {
    window.location.href = '/shopOwner/insertProduct';
  };

  const handleUpdateProduct = (productID: string) => {
    window.location.href = '/shopOwner/updateProduct/' + productID;
  };

  const handleForgotPassword = () => {
    window.location.href = '/shopOwner/updatePassword/';
  };

  return (
    <div>
      {shop?.banned ? (
        <div className={styles.banned}>Your shop is banned</div>
      ) : (
        <div>
          <Navbar />
          <div className={styles.contentInner}>
            <div className={styles.sellerProfile}>
              <div className={styles.sellerList}>
                <div className={styles.group1}>
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
                        {shop?.rating} Average Ratings |&nbsp;
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
                <div className={styles.group2}>
                  <button
                    className={styles.orangeBTN}
                    onClick={handleUpdateShop}
                  >
                    UPDATE
                  </button>
                  <button
                    className={styles.orangeBTN}
                    onClick={handleForgotPassword}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className={styles.spaceBetween}>
              <h3>My Products</h3>
              <button
                className={styles.orangeBTN}
                onClick={handleInsertProduct}
                style={{
                  padding: '5px',
                  marginRight: '10px',
                }}
              >
                Insert New Product
              </button>
            </div>
            <div>
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
                      <option value="50">50</option>
                      <option value={shopProducts.length}>All</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.search}></div>
              <div className={styles.container}>
                <div className={styles.productsContainer}>
                  {products?.map((p) => {
                    return (
                      <div className={styles.cardContainer}>
                        <img
                          src={p.images}
                          className={styles.productImage}
                        ></img>
                        <p className={styles.productName}>{p.name}</p>
                        <p className={styles.productPrice}>${p.price}</p>
                        <button
                          className={styles.updateBTN}
                          onClick={() => handleUpdateProduct(p.id)}
                        >
                          Update
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.contentContainer}>
            <h1 className={styles.sectionTitle}>ABOUT US</h1>
            <p>{shop?.name}</p>
            <div className={styles.aboutUsContent}>{shop?.aboutUs}</div>
            <button className={styles.orangeBTN} onClick={handleUpdateAbout}>
              Edit About Us
            </button>
          </div>
          <FooterMain />
        </div>
      )}
    </div>
  );
}
