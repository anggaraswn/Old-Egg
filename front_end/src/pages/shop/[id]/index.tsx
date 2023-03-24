import Navbar from '@/components/navbar';
import styles from './Index.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import FooterMain from '@/components/footerMain';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import ProductCard from '@/components/productCard';
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
  category: Category;
}

interface Category {
  id: string;
  name: string;
  description: string;
}

export default function ShopHomePage() {
  const router = useRouter();
  const { id } = router.query;
  const [shop, setShop] = useState<Shop | null>(null);
  const [fullStars, setFullStars] = useState(0);
  const [halfStars, setHalfStars] = useState(0);
  const [shopProducts, setShopProducts] = useState<Product[]>([]);
  const [shopCategory, setShopCategory] = useState<Category[]>([]);
  const [sortBy, setSortBy] = useState('topSold');
  const [productRecommendations, setproductRecommendations] = useState<
    Product[]
  >([]);

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

  const SHOP_PRODUCTS_QEURY = `query shopProducts($shopID: ID!, $sortBy: String){
    shopProducts(shopID: $shopID, sortBy: $sortBy){
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
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  useEffect(() => {
    GRAPHQLAPI.post('', {
      query: SHOP_PRODUCTS_QEURY,
      variables: {
        shopID: id,
        sortBy: sortBy,
      },
    })
      .then((response) => {
        console.log(response);
        setproductRecommendations(response.data.data.shopProducts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, sortBy]);

  useEffect(() => {
    setFullStars(Math.floor(shop?.rating));
    setHalfStars(Math.round(shop?.rating - fullStars));

    console.log(shopProducts);
    var categories: Category[] = [];
    shopProducts.map((s) => {
      console.log(s);
      var flag;
      if (categories.length == 0) {
        flag = false;
      } else {
        console.log(categories);
        flag = categories.some((obj) => obj.id === s.category.id);
      }

      if (!flag) {
        categories.push(s.category);
      }
    });
    setShopCategory(categories);
  }, [shop]);

  const handleAboutUs = () => {
    return '/shop/aboutUs/' + id;
  };

  const handleReviews = () => {
    return '/shop/review/' + id;
  };

  const handleAllProducts = () => {
    return '/shop/productsPage/' + id;
  };

  const handleCategory = (categoryID: string, categoryName: string) => {
    window.location.href =
      '/shop/products/' +
      id +
      `?categoryID=${categoryID}&categoryName=${categoryName}`;
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
                  <div className={`${styles['tabCell']} ${styles['curr']}`}>
                    <a href="#">Store Home</a>
                  </div>
                  <div className={styles.tabCell}>
                    <a href={handleAllProducts()}>All Products</a>
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
          <img className={styles.banner} src={shop?.banner} alt="" />
          <div className={styles.pageContentInner}>
            <section>
              <h1 className={styles.sectionTitle}>SHOP BY CATEGORY</h1>
              <div className={styles.categoriesContainer}>
                {shopCategory.map((c) => {
                  return (
                    <div
                      className={styles.categoriesItem}
                      onClick={() => handleCategory(c.id, c.name)}
                    >
                      <div>{c.name}</div>
                    </div>
                  );
                })}
              </div>
            </section>
            <section>
              <h1 className={styles.sectionTitle}>RECOMENDED PRODUCTS</h1>
              <div>
                <span>Filter By: </span>
                <select
                  value={sortBy}
                  // className={styles.forminputselection}
                  onChange={(event) => {
                    setSortBy(event.target.value);
                  }}
                  className={styles.selectstyle}
                >
                  <option value="topBuyed">Most Buyed</option>
                  <option value="topRating">Highest Rating</option>
                </select>
              </div>
              <div className={styles.productscontainer}>
                {productRecommendations?.map((s) => {
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
            </section>
          </div>
        </div>
      )}
      <FooterMain />
    </div>
  );
}
