import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import styles from './StoreReview.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

interface Shop {
  id: string;
  name: string;
  image: string;
  banner: string;
  followers: number;
  salesCount: number;
  policy: string;
  banned: boolean;
  rating: number;
}

export default function ReviewStore() {
  const router = useRouter();
  const { id } = router.query;
  const [shop, setShop] = useState<Shop | null>(null);
  const [fullStars, setFullStars] = useState(0);
  const [halfStars, setHalfStars] = useState(0);

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
      rating
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

  useEffect(() => {
    setFullStars(Math.floor(shop?.rating));
    setHalfStars(Math.round(shop?.rating - fullStars));
  }, [shop]);

  const handleHome = () => {
    return '/shop/' + id;
  };

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
                  <img src={shop?.image} alt="" className={styles.profilePic} />
                </div>
                <ul className={styles.sellerListInfo}>
                  <li className={styles.sellerHead}>
                    <span>{shop?.name}</span>
                  </li>
                  <div className={styles.sellerInfoContainer}>
                    <div className={styles.sellerData}>
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
                    </div>
                  </div>
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
              <div className={styles.tabCell}>
                <a href="#">All Products</a>
              </div>
              <div className={styles.tabCell}>
                <a href={handleReviews()}>Reviews</a>
              </div>
              <div className={styles.tabCell}>
                <a href="#">Return Policy</a>
              </div>
              <div className={`${styles.tabCell}  ${styles['curr']}`}>
                <a href={handleAboutUs()}>About Us</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.pageContentInner}>
        <h1 className={styles.sectionTitle}>FEEDBACK</h1>
        <div className={styles.reviewsRating}>
          <div className={styles.gridCol}>
            <div className={styles.reviewsRating}>
              <div className={styles.sellerDataRating}>
                {[...Array(fullStars >= 0 ? fullStars : 0)].map((_, index) => (
                  <FaStar key={index} className={styles.star} />
                ))}
                {[...Array(halfStars >= 0 ? halfStars : 0)].map((_, index) => (
                  <FaStarHalfAlt key={index} className={styles.star} />
                ))}
                &nbsp;{shop?.rating} Ratings
              </div>
              <div>
                To rate this seller or report a problem, please use the link
                provided in the order confirmation email or the order history
                section located in your account settings.
              </div>
            </div>
          </div>
          <div className={`${styles['gridCol']} ${styles['wide']}}`}>
            <div className={`${styles['gridCol']} ${styles['ratingBox']}`}>
              <div className={styles.ratingCell}>
                <div>
                  <div className={styles.cellName}>5 egg</div>
                  <div className={styles.cellChart}>{}</div>
                </div>
              </div>
              <div className={styles.ratingCell}></div>
              <div className={styles.ratingCell}></div>
              <div className={styles.ratingCell}></div>
              <div className={styles.ratingCell}></div>
            </div>
          </div>
        </div>
      </div>
      <FooterMain />
    </div>
  );
}
