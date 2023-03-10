import Navbar from '@/components/navbar';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './Index.module.css';
import WishList from '..';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { getCookie } from 'cookies-next';

interface WishList {
  id: string;
  name: string;
  option: string;
  notes: string;
}

export default function WishlistDetail() {
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
        console.log(response);
        setIsUpdateOpen(false);
        setChanges(changes + 1);
      });
    } else {
      setErrorMsg('Please choose whether public or privacy');
    }
  };

  console.log(id);

  useEffect(() => {
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
      })
      .catch((err) => {
        console.log(err);
      });
  }, [changes]);

  useEffect(() => {
    wishlist?.wishlistDetails.map((w) => {
      console.log(w.product.price * w.quantity);
      setSubtotalPrice(subTotalPrice + w.product.price * w.quantity);
    });
  }, [wishlist]);

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
      console.log(response);
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
      console.log(response);
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
          quantity: (document.getElementById('quantity') as HTMLInputElement)
            .value,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
      .then((response) => {
        console.log(response);
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
        console.log(response);
      });
    });
  };

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
                            <strong>${subTotalPrice}</strong>
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
                                      {[...Array(halfStars)].map((_, index) => (
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
                                      id="quantity"
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
