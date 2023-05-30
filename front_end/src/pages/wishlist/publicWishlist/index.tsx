import Navbar from '@/components/navbar';
import styles from './PublicWishlist.module.css';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';

interface Wishlist {
  id: string;
  name: string;
  option: string;
  notes: string;
  createdDate: string;
}

interface Product {
  id: string;
  name: string;
  images: string;
  description: string;
  price: number;
  stock: number;
  discount: number;
}

function PublicWishlistCard(props: { wishlist: Wishlist }) {
  const { wishlist } = props;
  const [products, setProducts] = useState<Product[] | null>([]);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [inputValue, setInputValue] = useState('');
  const token = getCookie('jwt');

  let counter = 0;
  let price = 0;
  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const GET_WISHLIST_DETAILS = `query wishlistDetails($wishlistID: ID!){
    wishlistDetails(wishlistID: $wishlistID){
      product{
        id,
        name,
        images,
        price,
        discount,
        stock,
        description
      }
    }
  }`;

  const FOLLOW_MUTATION = `mutation followWishlist($wishlistID: ID!){
    followWishlist(wishlistID: $wishlistID){
      wishlist{
        id,
        name
      },
      user{
        id,
        firstName
      }
    }
  }`;

  const CREATE_WISHLIST = `mutation createWishlist($name: String!, $option: Option!){
    createWishlist(name: $name, option:$option){
      id,
      name,
      option
    }
  }`;

  const ADD_TO_WISHLISTDETAIL = `mutation createWishlistDetail($wishlistID: ID!, $productID: ID!){
    createWishlistDetail(wishlistID: $wishlistID, productID: $productID){
      wishlist{
        id,
        name
      },
      product{
        id,
        name,
        price
      }
    }
  }`;

  useEffect(() => {
    GRAPHQLAPI.post('', {
      query: GET_WISHLIST_DETAILS,
      variables: {
        wishlistID: wishlist.id,
      },
    }).then((response) => {
      console.log(response.data.data.wishlistDetails);
      setProducts(response.data.data.wishlistDetails);
    });
  }, [wishlist]);

  const openWishlistDetail = () => {
    console.log('/wishlist/' + wishlist.id);
    window.location.href = '/wishlist/publicWishlist/' + wishlist.id;
  };

  const handleFollow = () => {
    GRAPHQLAPI.post(
      '',
      {
        query: FOLLOW_MUTATION,
        variables: {
          wishlistID: wishlist.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => [console.log(response)]);
  };

  const handleDuplicate = () => {
    GRAPHQLAPI.post(
      '',
      {
        query: CREATE_WISHLIST,
        variables: {
          name: `${wishlist.name} (Duplicate)`,
          option: 'PRIVATE',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      var wishlistID = response.data.data.createWishlist.id;
      // if (products) {
      //   products?.map((p) => {
      //     GRAPHQLAPI.post(
      //       '',
      //       {
      //         query: ADD_TO_WISHLISTDETAIL,
      //         variables: {
      //           wishlistID: wishlist.id,
      //           productID: p.id,
      //         },
      //       },
      //       {
      //         headers: {
      //           Authorization: `Bearer ${token}`,
      //         },
      //       },
      //     ).then((response) => {
      //       console.log(response);
      //     });
      //   });
      // }
      GRAPHQLAPI.post('', {
        query: GET_WISHLIST_DETAILS,
        variables: {
          wishlistID: wishlist.id,
        },
      }).then((response) => {
        console.log(response.data.data.wishlistDetails);
        response.data.data.wishlistDetails?.map((p) => {
          GRAPHQLAPI.post(
            '',
            {
              query: ADD_TO_WISHLISTDETAIL,
              variables: {
                wishlistID: wishlistID,
                productID: p.product.id,
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
      });
    });
  };

  return (
    <div
      className={`${styles.card} ${
        isUpdateOpen ? styles['openUpdate'] : styles['']
      }`}
    >
      <div className={styles.cardTitle}>
        <div>{wishlist.name}</div>
        <div className={styles.links}>
          <a href="#" onClick={handleFollow}>
            Follow
          </a>
          <a href="#" onClick={handleDuplicate}>
            Duplicate
          </a>
        </div>
      </div>
      <div className={styles.top} onClick={openWishlistDetail}>
        <ul className={styles.wishlistItem}>
          {products?.map((p) => {
            counter += 1;
            price += p.product.price;
            return (
              <li key={p.product.id}>
                <div className={styles.itemContainer}>
                  <img src={p?.product.images} alt="image logo" />
                  <p>{p.product.name}</p>
                  {/* <p>{p.product.description}</p> */}
                </div>
              </li>
            );
          })}
        </ul>
        <div className={styles.itemInfo}>
          <p>{counter} items</p>
          <p className={styles.price}>${price}</p>
        </div>
      </div>
    </div>
  );
}

export default function PublicWishlist() {
  const token = getCookie('jwt');
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const [currPage, setCurrPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [offsetWishlist, setOffsetWishlist] = useState(0);
  const [limitWishlist, setLimitWishlist] = useState(2);
  const [changes, setChanges] = useState(0);
  const [sortBy, setSortBy] = useState('');

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const GET_WISHLIST_QUERY = `query wishlists($filter: String, $sortBy: String, $limit: Int, $offset: Int){
    wishlists(filter: $filter, sortBy: $sortBy, limit: $limit, offset:$offset){
      id,
      name,
      user{
        id,
        firstName,
        lastName
      },
      option,
      notes,
      createdDate
    }
  }`;

  useEffect(() => {
    GRAPHQLAPI.post('', {
      query: GET_WISHLIST_QUERY,
      variables: {
        filter: 'PUBLIC',
      },
    }).then((response) => {
      console.log(response);
      setWishlists(response.data.data.wishlists);
    });
  }, []);

  useEffect(() => {
    GRAPHQLAPI.post('', {
      query: GET_WISHLIST_QUERY,
      variables: {
        filter: 'PUBLIC',
        sortBy: sortBy,
      },
    }).then((response) => {
      console.log(response);
      setWishlists(response.data.data.wishlists);
      setTotalPage(
        Math.ceil(response.data.data.wishlists.length / limitWishlist),
      );
      setCurrPage(1);
      setOffsetWishlist(0);
    });
  }, [changes]);

  useEffect(() => {
    GRAPHQLAPI.post('', {
      query: GET_WISHLIST_QUERY,
      variables: {
        filter: 'PUBLIC',
        limit: limitWishlist,
      },
    }).then((response) => {
      console.log(response);
      setWishlists(response.data.data.wishlists);
    });
  }, [limitWishlist]);

  useEffect(() => {
    GRAPHQLAPI.post('', {
      query: GET_WISHLIST_QUERY,
      variables: {
        filter: 'PUBLIC',
        limit: limitWishlist,
        offset: offsetWishlist,
      },
    })
      .then((response) => {
        console.log(response);
        setWishlists(response.data.data.wishlists);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [totalPage, offsetWishlist]);

  useEffect(() => {
    console.log('in');
    setOffsetWishlist((currPage - 1) * limitWishlist);
  }, [currPage]);

  useEffect(() => {
    setChanges(changes + 1);
  }, [sortBy]);

  const handleClick = (option: any) => {
    setSelected(option);
  };

  const openModal = () => {
    setIsOpen(true);
    console.log(isOpen);
  };

  const closeModal = () => {
    setIsOpen(false);
    console.log(isOpen);
  };

  const handlePrev = () => {
    if (currPage > 1) setCurrPage(currPage - 1);
  };

  const handleNext = () => {
    if (currPage < totalPage) setCurrPage(currPage + 1);
  };

  return (
    <div>
      <Navbar />
      <div
        className={`${styles['body']} ${isOpen ? styles['open'] : styles['']}`}
      >
        <div className={styles.background} onClick={closeModal}></div>
        {/* <div
          className={`${styles.modal} ${isOpen ? styles['open'] : styles['']}`}
        >
          <p className={styles.modalTitle}>Create a List</p>
          <div className={styles.form}>
            <label htmlFor="inputName">Name</label>
            <input type="text" id="inputName" />
          </div>
          <p className={styles.privacyTxt}>Privacy</p>
          <div className={styles.privacyContainer}>
            <div
              className={`${styles.publicP} ${
                selected === 'PUBLIC' ? styles.selected : ''
              }`}
              onClick={() => handleClick('PUBLIC')}
            >
              Public
            </div>
            <div
              className={`${styles.privateP} ${
                selected === 'PRIVATE' ? styles.selected : ''
              }`}
              onClick={() => handleClick('PRIVATE')}
            >
              Private
            </div>
          </div>
          <div className={styles.addLine}>
            <div className={styles.errorMsg}>{error}</div>
            <div className={styles.createBTNContainer}>
              <button onClick={createWishlist}>CREATE</button>
            </div>
          </div>
        </div> */}
        <div className={styles.container}>
          <p>Home &gt; Public Lists</p>
          <div className={styles.topBar}>
            <div className={styles.pageTitle}>WISH LIST</div>
            <button
              className={styles.selectedBTN}
              onClick={() => {
                window.location.href = '/wishlist/';
              }}
            >
              My Lists
            </button>
            <button
              className={styles.otherBTN}
              onClick={() => {
                window.location.href = '/followedList';
              }}
            >
              Followed Lists
            </button>
            <button className={styles.otherBTN}>Public Lists</button>
          </div>
          <div className={styles.pageSectionInner}>
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
                    <span>Page</span> <span>{currPage + '/' + totalPage}</span>
                  </div>
                )}
              </div>
              <div className={styles.sortByContainer}>
                <span>Filter By: </span>
                <select
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value);
                  }}
                  className={styles.selectstyle}
                >
                  <option value="all">All</option>
                  <option value="createdDate">Created At</option>
                  <option value="highestRating">Highest Rating</option>
                  <option value="lowestRating">Lowest Rating</option>
                  <option value="highestPrice">Highest Price</option>
                  <option value="lowestPrice">Lowest Price</option>
                  <option value="highestFollowers">Highest Followers</option>
                </select>
              </div>
              <div className={styles.paginationcontainer}>
                <b>View:</b>
                <select
                  value={limitWishlist}
                  className={styles.forminputselection}
                  onChange={(event) => {
                    setLimitWishlist(Number(event.target.value));
                  }}
                >
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="90">90</option>
                </select>
              </div>
            </div>
            <div className={styles.wishlistContainer}>
              {wishlists?.map((w) => {
                return <PublicWishlistCard wishlist={w} key={w.id} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
