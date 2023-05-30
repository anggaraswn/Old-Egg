import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import styles from './StoreReview.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar, FaStarHalfAlt, FaHeart, FaHeartBroken } from 'react-icons/fa';

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

interface ShopReview {
  id: string;
  shop: Shop;
  rating: number;
  review: number;
  reviewDetails: number;
  createdAt: string;
  deliveryOnTime: boolean;
  productAccuracy: boolean;
  serviceSatisfaction: boolean;
  helpful: boolean;
}

export default function ReviewStore() {
  const router = useRouter();
  const { id } = router.query;
  const [shop, setShop] = useState<Shop | null>(null);
  const [allShopReview, setAllShopReview] = useState<ShopReview[]>([]);
  const [shopReviews, setShopReviews] = useState<ShopReview[]>([]);
  const [fullStars, setFullStars] = useState(0);
  const [halfStars, setHalfStars] = useState(0);
  const [oneStar, setOneStar] = useState(0);
  const [twoStar, setTwoStar] = useState(0);
  const [threeStar, setThreeStar] = useState(0);
  const [fourStar, setFourStar] = useState(0);
  const [fiveStar, setFiveStar] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [onTimeDelivery, setOnTimeDelivery] = useState(0);
  const [productAccuracy, setProductAccuracy] = useState(0);
  const [serviceSatisfaction, setServiceSatisfaction] = useState(0);
  const [filterBy, setFilterBy] = useState('all');
  const [search, setSearch] = useState('');
  const [reviewStates, setReviewStates] = useState<
    { like: boolean; dislike: boolean }[]
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
      rating
    }
  }
  `;

  const GET_SHOP_REVIEWS_QUERY = `query shopReviews($shopID: ID!, $search: String, $filter: String){
    shopReviews(shopID: $shopID, search: $search, filter: $filter){
      id,
      user{
        id,
        firstName,
        lastName,
      },
      rating,
      review,
      reviewDetails,
      createdAt,
      deliveryOnTime,
      productAccuracy,
      serviceSatisfaction,
      helpful
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
          GRAPHQLAPI.post('', {
            query: GET_SHOP_REVIEWS_QUERY,
            variables: {
              shopID: id,
            },
          }).then((response) => {
            console.log(response);
            setAllShopReview(response.data.data.shopReviews);
            setShopReviews(response.data.data.shopReviews);
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);

  useEffect(() => {
    if (allShopReview) {
      var allRating = 0;
      var oneStar = 0;
      var twoStar = 0;
      var threeStar = 0;
      var fourStar = 0;
      var fiveStar = 0;

      var onTime = 0;
      var accuracy = 0;
      var satisfaction = 0;
      allShopReview.map((x) => {
        allRating += x.rating;

        if (x.rating == 1) {
          oneStar += 1;
        } else if (x.rating == 2) {
          twoStar += 1;
        } else if (x.rating == 3) {
          threeStar += 1;
        } else if (x.rating == 4) {
          fourStar += 1;
        } else if (x.rating == 5) {
          fiveStar += 1;
        }

        if (x.deliveryOnTime) {
          onTime += 1;
        }
        if (x.productAccuracy) {
          accuracy += 1;
        }
        if (x.serviceSatisfaction) {
          satisfaction += 1;
        }
      });
      setOneStar(oneStar);
      setTwoStar(twoStar);
      setThreeStar(threeStar);
      setFourStar(fourStar);
      setFiveStar(fiveStar);
      setAvgRating(allRating / allShopReview.length);

      setProductAccuracy(accuracy);
      setOnTimeDelivery(onTime);
      setServiceSatisfaction(satisfaction);
    }
    setFullStars(Math.floor(avgRating));
    setHalfStars(Math.round(avgRating - fullStars));
  }, [allShopReview]);

  useEffect(() => {
    if (id) {
      GRAPHQLAPI.post('', {
        query: GET_SHOP_REVIEWS_QUERY,
        variables: {
          shopID: id,
          search: search,
          filter: filterBy,
        },
      }).then((response) => {
        console.log(response);
        setShopReviews(response.data.data.shopReviews);
      });
    }
  }, [filterBy, search]);

  useEffect(() => {
    const initialStates = shopReviews.map((sr) => {
      return {
        like: false,
        dislike: false,
      };
    });
    setReviewStates(initialStates);
  }, [shopReviews]);

  const handleHome = () => {
    return '/shop/' + id;
  };

  const handleAboutUs = () => {
    return '/shop/aboutUs/' + id;
  };

  const handleReviews = () => {
    return '/shop/review/' + id;
  };

  const handleAllProducts = () => {
    return '/shop/productsPage/' + id;
  };

  const handleSearch = (event: any) => {
    console.log(event.target.value);
    setSearch(event.target.value);
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
                <a href={handleAllProducts()}>All Products</a>
              </div>
              <div className={`${styles['tabCell']} ${styles['curr']}`}>
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
                &nbsp;{avgRating} Ratings from {shopReviews.length} feedback
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
                <span>5 egg</span>
                <span>
                  &nbsp;{fiveStar}&nbsp;(
                  {allShopReview.length == 0
                    ? '0'
                    : (fiveStar * 100) / allShopReview.length}
                  %)
                </span>
              </div>
              <div className={styles.ratingCell}>
                <span>4 egg</span>
                <span>
                  &nbsp;{fourStar}&nbsp;(
                  {allShopReview.length == 0
                    ? '0'
                    : (fourStar * 100) / allShopReview.length}
                  %)
                </span>
              </div>
              <div className={styles.ratingCell}>
                <span>3 egg</span>
                <span>
                  &nbsp;{threeStar}&nbsp;(
                  {allShopReview.length == 0
                    ? '0'
                    : (threeStar * 100) / allShopReview.length}
                  %)
                </span>
              </div>
              <div className={styles.ratingCell}>
                <span>2 egg</span>
                <span>
                  &nbsp;{twoStar}&nbsp;(
                  {allShopReview.length == 0
                    ? '0'
                    : (twoStar * 100) / allShopReview.length}
                  %)
                </span>
              </div>
              <div className={styles.ratingCell}>
                <span>1 egg</span>
                <span>
                  &nbsp;{oneStar}&nbsp;(
                  {allShopReview.length == 0
                    ? '0'
                    : (oneStar * 100) / allShopReview.length}
                  %)
                </span>
              </div>
            </div>
          </div>
          <div className={styles.chartContainer}>
            <div className={styles.chart}>
              <div>
                {allShopReview.length == 0
                  ? '0'
                  : (onTimeDelivery * 100) / allShopReview.length}
                %
              </div>
              <div>ON-TIME</div>
              <div>DELIVERY</div>
            </div>
            <div className={styles.chart}>
              <div>
                {allShopReview.length == 0
                  ? '0'
                  : (productAccuracy * 100) / allShopReview.length}
                %
              </div>
              <div>PRODUCT</div>
              <div>ACCURACY</div>
            </div>
            <div className={styles.chart}>
              <div>
                {allShopReview.length == 0
                  ? '0'
                  : (serviceSatisfaction * 100) / allShopReview.length}
                %
              </div>
              <div>SERVICE</div>
              <div>SATISFACTION</div>
            </div>
          </div>
          <div className={styles.reviews}>
            <div className={styles.search}>
              <input
                type="text"
                className={styles.input}
                value={search}
                onChange={handleSearch}
              />
            </div>
            <div className={styles.sortByContainer}>
              <span>Filter By: </span>
              <select
                value={filterBy}
                onChange={(event) => {
                  setFilterBy(event.target.value);
                }}
                className={styles.selectstyle}
              >
                <option value="all">All</option>
                <option value="30">30 Days</option>
                <option value="60">60 days</option>
                <option value="12">1 Year</option>
              </select>
            </div>
            <div className={styles.reviewCard}>
              {shopReviews.map((sr, i) => {
                return (
                  <div className={styles.card} key={i}>
                    <div className={styles.left}>
                      <div>
                        {sr.user.firstName} {sr.user.lastName}
                      </div>
                      <div>{new Date(sr.createdAt).toDateString()}</div>
                    </div>
                    <div className={styles.reviewContent}>
                      <div>
                        <b> {sr.review}</b>
                      </div>
                      <div>{sr.reviewDetails}</div>
                    </div>
                    <div className={styles.right}>
                      <p>Did you find this review helpful?</p>
                      <div>
                        <button
                          className={
                            reviewStates[i]?.like
                              ? styles.selectedButton
                              : styles.unselectedButton
                          }
                          onClick={() => {
                            const newStates = [...reviewStates];
                            newStates[i].like = true;
                            newStates[i].dislike = false;
                            setReviewStates(newStates);
                          }}
                        >
                          <FaHeart />
                        </button>
                        <button
                          className={
                            reviewStates[i]?.dislike
                              ? styles.selectedButton
                              : styles.unselectedButton
                          }
                          onClick={() => {
                            const newStates = [...reviewStates];
                            newStates[i].like = false;
                            newStates[i].dislike = true;
                            setReviewStates(newStates);
                          }}
                        >
                          <FaHeartBroken />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <FooterMain />
    </div>
  );
}
