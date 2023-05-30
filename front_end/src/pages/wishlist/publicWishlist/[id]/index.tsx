import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import styles from './Index.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

interface WishList {
  id: string;
  name: string;
  option: string;
  notes: string;
}

interface WishlistReview {
  id: string;
  wishlist: WishList;
  rating: number;
  review: string;
  detailReview: string;
  name: string;
}

export default function PublicWishlistDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [wishlist, setWishlist] = useState<WishList | null>(null);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [changes, setChanges] = useState(0);
  const [addNote, setAddNote] = useState(false);
  const [subTotalPrice, setSubtotalPrice] = useState(0);
  const token = getCookie('jwt');
  const [wishlistReviews, setWishlistReviews] = useState<WishlistReview[]>([]);
  const [fullStars, setFullStars] = useState(0);
  const [halfStars, setHalfStars] = useState(0);
  const [oneStar, setOneStar] = useState(0);
  const [twoStar, setTwoStar] = useState(0);
  const [threeStar, setThreeStar] = useState(0);
  const [fourStar, setFourStar] = useState(0);
  const [fiveStar, setFiveStar] = useState(0);
  const [avgRating, setAvgRating] = useState(0);

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });

  const GET_WISHLIST = `query wishlist($wishlistID: ID!){
    wishlist(wishlistID: $wishlistID){
      id,
      name,
      user{
        id,
        lastName
      },
      option,
      notes
      wishlistDetails{
        product{
          id,
          name,
          price,
          images,
          discount,
          stock,
          rating,
          numberOfRatings
        },
        quantity
      }
    }
  }`;
  const UPDATE_WISHLIST_MUTATION = `mutation updateWishlist($wishlistID: ID!, $name:String!, $option: String!, $notes: String){
    updateWishlist(wishlistID: $wishlistID, name: $name, option: $option, notes: $notes){
      id,
      name,
      option,
      notes
    }
  }`;
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

  const DELETE_WISHLIST_DETAILS_MUTATION = `mutation deleteWishlistDetails($wishlistID: ID!, $productID:ID!){
    deleteWishlistDetail(wishlistID: $wishlistID, productID: $productID){
      wishlist{
        id,
        name
      },
      product{
        id,
        name
      }
    }
  }`;

  const UPDATE_WISHLIST_DETAIL_MUTATION = `mutation updateWishlistDetail($wishlistID: ID!, $productID: ID!, $quantity: Int){
    updateWishlistDetail(wishlistID: $wishlistID, productID: $productID, quantity: $quantity){
      wishlist{
        name
      },
      product{
        name
      },
      quantity
    }
  }`;

  const ADD_TO_CART_MUTATION = `mutation createCart($productID: ID!, $quantity: Int!, $notes: String!){
    createCart(input:{
        productID: $productID,
        quantity: $quantity,
        notes: $notes
      }){
        quantity,
        notes
      }
    }`;

  const GET_WISHLIST_REVIEW = `query wishlistReviews($wishlistID: ID!){
      wishlistReviews(wishlistID: $wishlistID){
        id,
        rating,
        review,
        detailReview,
        user{
          firstName,
          lastName
        },
        name
      }
    }`;

  const ADD_NEW_COMMENT_MUTATION = `mutation createWishlistReview($wishlistID: ID!, $rating: Float!, $review: String!, $detailReview: String!, $name: String){
      createWishlistReview(wishlistID: $wishlistID, rating: $rating, review: $review, detailReview: $detailReview, name: $name){
        id,
        rating,
        review,
        detailReview,
        name
      }
    }`;

  const openUpdateModal = () => {
    setIsUpdateOpen(true);
    console.log(isUpdateOpen);
  };

  const closeUpdateModal = () => {
    setIsUpdateOpen(false);
    console.log(isUpdateOpen);
  };

  const handleClickOption = (option: any) => {
    setSelectedOption(option);
  };

  const saveUpdate = () => {
    if (selectedOption) {
      GRAPHQLAPI.post(
        '',
        {
          query: UPDATE_WISHLIST_MUTATION,
          variables: {
            wishlistID: wishlist?.id,
            name: (document.getElementById('inputUpdate') as HTMLInputElement)
              .value,
            option: selectedOption,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ).then((response) => {
        // console.log(response);
        setIsUpdateOpen(false);
        setChanges(changes + 1);
      });
    } else {
      setErrorMsg('Please choose whether public or privacy');
    }
  };

  console.log(id);

  useEffect(() => {
    if (id) {
      GRAPHQLAPI.post('', {
        query: GET_WISHLIST_REVIEW,
        variables: {
          wishlistID: id,
        },
      }).then((response) => {
        // console.log(response);
        setWishlistReviews(response.data.data.wishlistReviews);
      });
    }
    setChanges(changes + 1);
  }, [id]);

  useEffect(() => {
    GRAPHQLAPI.post('', {
      query: GET_WISHLIST,
      variables: {
        wishlistID: id,
      },
    })
      .then((response) => {
        setSubtotalPrice(0);
        setWishlist(response.data.data.wishlist);
        // console.log(response.data.data.wishlist.wishlistDetails.length);
        // wishlist?.wishlistDetails.map((w) => {
        //   console.log(w.product.price * w.quantity);
        //   setSubtotalPrice(subTotalPrice + w.product.price * w.quantity);
        // });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [changes]);

  useEffect(() => {
    var total = 0;
    wishlist?.wishlistDetails.map((w) => {
      total += w.product.price * w.quantity;
      // console.log(w.product.price * w.quantity);
      // setSubtotalPrice(subTotalPrice + w.product.price * w.quantity);
    });
    setSubtotalPrice(total);
  }, [wishlist]);

  useEffect(() => {
    if (wishlistReviews) {
      var allRating = 0;
      var oneStar = 0;
      var twoStar = 0;
      var threeStar = 0;
      var fourStar = 0;
      var fiveStar = 0;

      var onTime = 0;
      var accuracy = 0;
      var satisfaction = 0;
      wishlistReviews.map((x) => {
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
      });
      setOneStar(oneStar);
      setTwoStar(twoStar);
      setThreeStar(threeStar);
      setFourStar(fourStar);
      setFiveStar(fiveStar);
      setAvgRating(allRating / wishlistReviews.length);
    }

    setFullStars(Math.floor(avgRating));
    setHalfStars(Math.round(avgRating - fullStars));
  }, [wishlistReviews]);

  const removeItem = (productID: string) => {
    GRAPHQLAPI.post(
      '',
      {
        query: DELETE_WISHLIST_DETAILS_MUTATION,
        variables: {
          wishlistID: wishlist?.id,
          productID: productID,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      // console.log(response);
      setChanges(changes + 1);
    });
  };

  const handleAddNotes = () => {
    setAddNote(true);
    console.log(addNote);
  };

  const addNotes = () => {
    console.log((document.getElementById('notes') as HTMLInputElement).value);
    GRAPHQLAPI.post(
      '',
      {
        query: UPDATE_WISHLIST_MUTATION,
        variables: {
          wishlistID: wishlist?.id,
          name: wishlist?.name,
          option: selectedOption,
          notes: (document.getElementById('notes') as HTMLInputElement).value,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      // console.log(response);
      setChanges(changes + 1);
      setAddNote(false);
    });
  };

  const updateQuantity = (productID: string) => {
    GRAPHQLAPI.post(
      '',
      {
        query: UPDATE_WISHLIST_DETAIL_MUTATION,
        variables: {
          wishlistID: wishlist?.id,
          productID: productID,
          quantity: (
            document.getElementById(`quantity-${productID}`) as HTMLInputElement
          ).value,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => {
        // console.log(response);
        setChanges(changes + 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddAllToCart = () => {
    console.log('Add All To Cart');
    wishlist?.wishlistDetails.map((w) => {
      GRAPHQLAPI.post(
        '',
        {
          query: ADD_TO_CART_MUTATION,
          variables: {
            productID: w.product.id,
            quantity: w.quantity,
            notes: '',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ).then((response) => {
        // console.log(response);
      });
    });
  };

  const handleAddNewComment = () => {
    var name;
    if ((document.getElementById('name') as HTMLInputElement).checked) {
      name = 'Anonymous';
      console.log('in');
    } else {
      name = `${wishlist.user.firstName} ${wishlist.user.lastName}`;
    }
    GRAPHQLAPI.post(
      '',
      {
        query: ADD_NEW_COMMENT_MUTATION,
        variables: {
          wishlistID: id,
          rating: (document.getElementById('rating') as HTMLInputElement).value,
          review: (document.getElementById('review') as HTMLInputElement).value,
          detailReview: (
            document.getElementById('reviewDetail') as HTMLInputElement
          ).value,
          name: name,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      setChanges(changes + 1);
    });
  };

  console.log(subTotalPrice);
  return (
    <div
      className={` ${styles['body']} ${
        isUpdateOpen ? styles['openUpdate'] : styles['']
      }`}
    >
      <div className={styles.background} onClick={closeUpdateModal}></div>
      <Navbar />
      <div
        className={`${styles.updateModal} ${
          isUpdateOpen ? styles['openUpdate'] : styles['']
        }`}
      >
        <div className={styles.topModal}>
          <p className={styles.updateModalTitle}>List Settings</p>
          <a href="#" onClick={closeUpdateModal} className={styles.close}>
            <img src="/assets/icon-close.png" alt="" />
          </a>
        </div>
        <div className={styles.updateForm}>
          <label htmlFor="inputUpdate">Name</label>
          <input type="text" id="inputUpdate" defaultValue={wishlist?.name} />
        </div>
        <p className={styles.privacyTxt}>Privacy</p>
        <div className={styles.privacyContainer}>
          <div
            className={`${styles.publicP} ${
              selectedOption === 'PUBLIC' ? styles.selected : ''
            }`}
            onClick={() => handleClickOption('PUBLIC')}
          >
            Public
          </div>
          <div
            className={`${styles.privateP} ${
              selectedOption === 'PRIVATE' ? styles.selected : ''
            }`}
            onClick={() => handleClickOption('PRIVATE')}
          >
            Private
          </div>
        </div>
        <div className={styles.addLine}>
          <div className={styles.errorMsg}>{errorMsg}</div>
          <div className={styles.createBTNContainer}>
            <button onClick={saveUpdate}>Save</button>
          </div>
        </div>
      </div>
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
                      <button onClick={openUpdateModal}>SETTINGS</button>
                    </div>
                    {wishlist?.wishlistDetails.length != 0 ? (
                      <div className={styles.toolsBar}>
                        <div className={styles.subTotal}>
                          <p>
                            Subtotal({wishlist?.wishlistDetails.length} items):{' '}
                            <strong>${subTotalPrice.toFixed(2)}</strong>
                          </p>
                        </div>
                        <button
                          className={`${styles.orangeBTN} ${styles.addAllToCartBTN}`}
                          onClick={handleAddAllToCart}
                        >
                          ADD ALL TO CART
                        </button>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {addNote ? (
                      // <input type="text" />
                      <div className={styles.addNotes}>
                        <p>Note</p>
                        <textarea
                          name="notes"
                          id="notes"
                          // cols={40}
                          rows={8}
                          maxLength={500}
                          defaultValue={wishlist?.notes}
                        ></textarea>
                        <div className={styles.addNotesBTNContainer}>
                          <button
                            className={styles.orangeBTN}
                            onClick={addNotes}
                          >
                            {wishlist?.notes ? 'Edit' : 'Add'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.notes}>
                        {wishlist?.notes ? (
                          <div className={styles.wishlistNotes}>
                            <p className={styles.noteText}>{wishlist?.notes}</p>
                            <div
                              className={styles.editLink}
                              onClick={handleAddNotes}
                            >
                              Edit
                            </div>
                          </div>
                        ) : (
                          <button onClick={handleAddNotes}>ADD NOTES</button>
                        )}
                      </div>
                    )}
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
                          <div className={styles.item} key={w.product.id}>
                            <div className={styles.itemContainer}>
                              <img
                                src={w.product.images}
                                alt=""
                                width={115}
                                height={86}
                              />
                              <div className={styles.itemNonImage}>
                                <div className={styles.itemInfo}>
                                  <div className={styles.itemInfoInner}>
                                    <div className={styles.itemBranding}>
                                      <div>
                                        {[
                                          ...Array(
                                            fullStars >= 0 ? fullStars : 0,
                                          ),
                                        ].map((_, index) => (
                                          <FaStar
                                            key={index}
                                            className={styles.star}
                                          />
                                        ))}
                                        {[
                                          ...Array(
                                            halfStars >= 0 ? halfStars : 0,
                                          ),
                                        ].map((_, index) => (
                                          <FaStarHalfAlt
                                            key={index}
                                            className={styles.star}
                                          />
                                        ))}
                                      </div>
                                      <div>({w.product.numberOfRatings})</div>
                                    </div>
                                    <div>{w.product.name}</div>
                                  </div>
                                </div>
                                <div className={styles.itemAction}>
                                  <p className={styles.price}>
                                    ${w.product.price}
                                  </p>
                                  <p>Free Shipping</p>
                                  <div className={styles.itemOperate}>
                                    <div className={styles.itemBTNContainer}>
                                      <input
                                        type="number"
                                        className={styles.quantity}
                                        defaultValue={w.quantity}
                                        min={1}
                                        max={w.product.stock}
                                        onChange={() => {
                                          updateQuantity(w.product.id);
                                        }}
                                        id={`quantity-${w.product.id}`}
                                      />
                                      <button
                                        className={`${styles.orangeBTN} ${styles.addToCartBTN}`}
                                      >
                                        ADD TO CART
                                      </button>
                                    </div>
                                    <div className={styles.removeContainer}>
                                      <button
                                        onClick={() => {
                                          removeItem(w.product.id);
                                        }}
                                      >
                                        <img
                                          src="/assets/icon-delete.png"
                                          alt=""
                                          height={12}
                                          width={11}
                                        />{' '}
                                        REMOVE
                                      </button>
                                      <div>
                                        <input type="checkbox" />
                                        COMPARE
                                      </div>
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
            <div className={styles.review}>
              <h1>COMMENTS</h1>
              <div className={styles.reviewsRating}>
                <div className={styles.sellerDataRating}>
                  Average Rating =&nbsp;
                  {[...Array(fullStars >= 0 ? fullStars : 0)].map(
                    (_, index) => (
                      <FaStar key={index} className={styles.star} />
                    ),
                  )}
                  {[...Array(halfStars >= 0 ? halfStars : 0)].map(
                    (_, index) => (
                      <FaStarHalfAlt key={index} className={styles.star} />
                    ),
                  )}
                  &nbsp;{avgRating} &nbsp; from {wishlistReviews?.length}{' '}
                  reviews
                </div>
              </div>
              <div className={`${styles['gridCol']} ${styles['ratingBox']}`}>
                <div className={styles.ratingCell}>
                  <span>5 egg</span>
                  <span>
                    &nbsp;{fiveStar}&nbsp;(
                    {wishlistReviews?.length == 0
                      ? '0'
                      : (fiveStar * 100) / wishlistReviews?.length}
                    %)
                  </span>
                </div>
                <div className={styles.ratingCell}>
                  <span>4 egg</span>
                  <span>
                    &nbsp;{fourStar}&nbsp;(
                    {wishlistReviews?.length == 0
                      ? '0'
                      : (fourStar * 100) / wishlistReviews?.length}
                    %)
                  </span>
                </div>
                <div className={styles.ratingCell}>
                  <span>3 egg</span>
                  <span>
                    &nbsp;{threeStar}&nbsp;(
                    {wishlistReviews?.length == 0
                      ? '0'
                      : (threeStar * 100) / wishlistReviews?.length}
                    %)
                  </span>
                </div>
                <div className={styles.ratingCell}>
                  <span>2 egg</span>
                  <span>
                    &nbsp;{twoStar}&nbsp;(
                    {wishlistReviews?.length == 0
                      ? '0'
                      : (twoStar * 100) / wishlistReviews?.length}
                    %)
                  </span>
                </div>
                <div className={styles.ratingCell}>
                  <span>1 egg</span>
                  <span>
                    &nbsp;{oneStar}&nbsp;(
                    {wishlistReviews?.length == 0
                      ? '0'
                      : (oneStar * 100) / wishlistReviews?.length}
                    %)
                  </span>
                </div>
              </div>
              <div className={styles.reviewsContainer}>
                {wishlistReviews?.map((wr) => {
                  return (
                    <div className={styles.reviewCard}>
                      <div>
                        <b> {wr.review}</b>
                      </div>
                      <div>{wr.detailReview}</div>
                      <div>Rating = {wr.rating}</div>
                      <div>By: {wr.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className={styles.addNewComment}>
              <h1>ADD NEW COMMENT</h1>
              <div className={styles.inputNew}>
                <label htmlFor="review">Input Review Title</label>
                <input type="text" id="review" />
              </div>
              <div className={styles.inputNew}>
                <label htmlFor="reviewDetail">Input Detail Review</label>
                <input type="text" id="reviewDetail" />
              </div>
              <div className={styles.inputNew}>
                <label htmlFor="rating">Input rating</label>
                <input type="number" id="rating" />
              </div>
              <div className={styles.inputNew}>
                <label htmlFor="name">Display as anonymous?</label>
                <input type="checkbox" id="name" />
              </div>
              <button
                className={styles.orangeBTN}
                onClick={handleAddNewComment}
              >
                Add
              </button>
            </div>
          </div>
        </section>
      </div>
      <FooterMain />
    </div>
  );
}
