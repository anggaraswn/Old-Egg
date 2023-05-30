import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import styles from '../styles/FollowedList.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';

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

function PublicWishlistCard(props: {
  wishlist: Wishlist;
  handleChanges: Function;
}) {
  const { wishlist, handleChanges } = props;
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

  const UNFOLLOW_MUTATION = `mutation unfollowWishlist($wishlistID: ID!){
    unfollowWishlist(wishlistID: $wishlistID){
      wishlist{
        id,
        name
      },
      user{
        id,
        firstName,
        lastName
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

  const handleUnfollow = () => {
    GRAPHQLAPI.post(
      '',
      {
        query: UNFOLLOW_MUTATION,
        variables: {
          wishlistID: wishlist.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      handleChanges();
    });
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
          <a href="#" onClick={handleUnfollow}>
            Unfollow
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

export default function FollowedList() {
  const token = getCookie('jwt');
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [changes, setChanges] = useState(0);

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const GET_FOLLOWED_QUERY = `query{
    userFollowedWishlists{
      wishlist{
        id,
        name,
        option,
        notes,
        wishlistDetails{
          product{
            id,
            name,
            images,
            price,
            discount,
            rating,
            stock
          }
        }
      }
    }
  }`;

  useEffect(() => {
    GRAPHQLAPI.post(
      '',
      {
        query: GET_FOLLOWED_QUERY,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      setWishlists(response.data.data.userFollowedWishlists);
    });
  }, [changes]);

  const handleChanges = () => {
    setChanges(changes + 1);
    console.log('in');
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <p>Home &gt; Followed List</p>
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
          <button
            className={styles.otherBTN}
            onClick={() => {
              window.location.href = '/wishlist/publicWishlist/';
            }}
          >
            Public Lists
          </button>
        </div>
        <div className={styles.pageSectionInner}>
          <div className={styles.wishlistContainer}>
            {wishlists?.map((w) => {
              return (
                <PublicWishlistCard
                  wishlist={w.wishlist}
                  key={w.wishlist.id}
                  handleChanges={handleChanges}
                />
              );
            })}
          </div>
        </div>
      </div>
      <FooterMain />
    </div>
  );
}
