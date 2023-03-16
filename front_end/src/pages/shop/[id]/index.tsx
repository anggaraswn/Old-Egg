import Navbar from '@/components/navbar';
import styles from './Index.module.css';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import FooterMain from '@/components/footerMain';
// import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

export default function ShopHomePage() {
  const router = useRouter();
  const { id } = router.query;
  const [shop, setShop] = useState([]);

  // const fullStars = Math.floor(w.product.rating);
  // const halfStars = Math.round(w.product.rating - fullStars);

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
      banned
    }
  }
  `;

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
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleAboutUs = () => {
    return '/shop/aboutUs/' + id;
  };

  const handleReviews = () => {
    return '/shop/review/' + id;
  };
  return (
    <div className={styles.body}>
      <Navbar />
      <div className={styles.sellerProfileContainer}>
        <div className={styles.sellerHeader}>
          <div className={styles.contentInner}>
            <div className={styles.sellerProfile}>
              <div className={styles.sellerList}>
                <div className={styles.avatar}>
                  <img src={shop.image} alt="" className={styles.profilePic} />
                </div>
                <ul className={styles.sellerListInfo}>
                  <li className={styles.sellerHead}>
                    <span>{shop.name}</span>
                  </li>
                  <li className={styles.sellerData}>
                    <span className={styles.sellerDataSales}>
                      {shop.salesCount} Sales |&nbsp;
                    </span>
                    <span className={styles.sellerDataFollow}>
                      {shop.followers} Followers |&nbsp;
                    </span>
                    <div className={styles.sellerDataRating}></div>
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
      <img className={styles.banner} src={shop.banner} alt="" />
      <div className={styles.pageContentInner}>
        <h1 className={styles.sectionTitle}>SHOP BY CATEGORY</h1>
      </div>
      <FooterMain />
    </div>
  );
}
