import axios from 'axios';
import styles from './WishlistCard.module.css';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';

interface Wishlist {
  id: string;
  name: string;
  option: string;
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

export default function WishlistCard(props: { wishlist: Wishlist }) {
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
  const UPDATE_WISHLIST_MUTATION = `mutation updateWishlist($wishlistID: ID!, $name: String!, $option: String!){
    updateWishlist(wishlistID: $wishlistID, name: $name, option: $option){
      id,
      name,
      option
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

  const handleInput = () => {
    setInputValue(
      (document.getElementById(`input${wishlist.id}`) as HTMLInputElement)
        .value,
    );
    console.log(inputValue);
  };

  const saveUpdate = () => {
    if (selectedOption) {
      console.log(inputValue);
      GRAPHQLAPI.post(
        '',
        {
          query: UPDATE_WISHLIST_MUTATION,
          variables: {
            wishlistID: wishlist.id,
            name: inputValue,
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
      });
    } else {
      setErrorMsg('Please choose whether public or privacy');
    }
  };

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
  // console.log(isUpdateOpen);

  const openWishlistDetail = () => {
    console.log('/wishlist/' + wishlist.id);
    window.location.href = '/wishlist/' + wishlist.id;
  };
  return (
    <div
      className={`${styles.card} ${
        isUpdateOpen ? styles['openUpdate'] : styles['']
      }`}
    >
      <div className={styles.background} onClick={closeUpdateModal}></div>
      <div
        className={`${styles.updateModal} ${
          isUpdateOpen ? styles['openUpdate'] : styles['']
        }`}
      >
        <div className={styles.topModal}>
          <p className={styles.updateModalTitle}>List Settings</p>
          <a
            href="#"
            onClick={() => {
              setIsUpdateOpen(false);
            }}
            className={styles.close}
          >
            <img src="/assets/icon-close.png" alt="" />
          </a>
        </div>
        <div className={styles.updateForm}>
          <label htmlFor="inputUpdate">Name</label>
          <input
            type="text"
            id={`input${wishlist.id}`}
            defaultValue={wishlist.name}
            onChange={handleInput}
          />
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
      <div className={styles.cardTitle}>
        <div>{wishlist.name}</div>
        <div className={styles.links}>
          <a href="#" onClick={openUpdateModal}>
            Update
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
