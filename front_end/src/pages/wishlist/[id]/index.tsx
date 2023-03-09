import Navbar from '@/components/navbar';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './Index.module.css';
import WishList from '..';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

interface WishList {
  id: string;
  name: string;
  option: string;
}

export default function WishlistDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [wishlist, setWishlist] = useState<WishList | null>(null);

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  // const GET_WISHLIST_DETAILS = `query wishlistDetails($wishlistID: ID!){
  //   wishlistDetails(wishlistID: $wishlistID){
  //     wishlist{
  //       name,
  //       option
  //     },
  //     product{
  //       id,
  //       name,
  //       images,
  //       price,
  //       discount,
  //       stock,
  //       description
  //     }
  //   }
  // }`;
  const GET_WISHLIST = `query wishlist($wishlistID: ID!){
    wishlist(wishlistID: $wishlistID){
      id,
      name,
      user{
        id,
        lastName
      },
      option,
      wishlistDetails{
        product{
          id,
          name,
          price,
          images,
          discount,
          stock,
          rating
        }
      }
    }
  }`;

  console.log(id);

  useEffect(() => {
    GRAPHQLAPI.post('', {
      query: GET_WISHLIST,
      variables: {
        wishlistID: id,
      },
    })
      .then((response) => {
        console.log(response);
        setWishlist(response.data.data.wishlist);
        console.log(response.data.data.wishlist.wishlistDetails.length);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  return (
    <div>
      <Navbar />
      <div className={styles.topBar}>
        Home &gt; My Wish List &gt; {wishlist?.name}
      </div>
      <hr />
      <div className={styles.pageContent}>
        <section>
          <div className={styles.pageSectionInner}>
            <div className={styles.container}>
              <div className={styles.left}>
                <div className={styles.side}>
                  <div className={styles.sideInner}>
                    <div className={styles.title}>{wishlist?.name}</div>
                    <div className={styles.info}>
                      <div>{wishlist?.option}</div>
                      <button>SETTINGS</button>
                    </div>
                    <div className={styles.notes}>
                      <button>ADD NOTES</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.right}>
                {wishlist?.wishlistDetails.length == 0 ? (
                  <div className={styles.noDataMSG}>
                    <div className={styles.title}>0 ITEMS IN LIST</div>
                    <div className={styles.text}>
                      Explore the recommendations below or search for an item
                      you'd like to add.
                    </div>
                    <img
                      src="/assets/icon-surprise.png"
                      alt=""
                      height={'165px'}
                    />
                  </div>
                ) : (
                  <div className={styles.list}>
                    <div className={styles.listTool}></div>
                    <div className={styles.items}>
                      {wishlist?.wishlistDetails.map((w) => {
                        console.log(w.product);
                        const fullStars = Math.floor(w.product.rating);
                        const halfStars = Math.round(
                          w.product.rating - fullStars,
                        );
                        return (
                          <div className={styles.item}>
                            <div className={styles.itemContainer}>
                              <img
                                src={w.product.images}
                                alt=""
                                width={115}
                                height={86}
                              />
                              <div className={styles.itemInfo}>
                                <div className={styles.itemInfoInner}>
                                  <div className={styles.itemBranding}>
                                    <div>
                                      {[...Array(fullStars)].map((_, index) => (
                                        <FaStar
                                          key={index}
                                          className={styles.star}
                                        />
                                      ))}
                                      {/* {[...Array(halfStars)].map((_, index) => (
                                        <FaStarHalfAlt key={index} />
                                      ))} */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
