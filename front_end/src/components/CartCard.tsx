import axios from 'axios';
import styles from './CartCard.module.css';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

interface Product {
  id: string;
  name: string;
  images: string;
  price: number;
  rating: number;
  numberOfReviews: number;
  numberBought: number;
  stock: number;
  description: string;
  discount: number;
}

interface Cart {
  product: Product;
  quantity: number;
  notes: string;
}

interface WishList {
  id: string;
  name: string;
  option: string;
}

export default function CartCard(props: { cart: Cart }) {
  const { cart } = props;
  const token = getCookie('jwt');
  const [isOpen, setIsOpen] = useState(false);
  const [wishlist, setWishlist] = useState<WishList[]>([]);
  const [selected, setSelected] = useState(null);

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const UPDATE_CART_MUTATION = `mutation updateCart($productID: ID!, $quantity: Int!, $notes: String!){
    updateCart(input:{
      productID: $productID,
      quantity: $quantity,
      notes: $notes
    }){
      user{
        id
      },
      product{
        id,
        name,
        stock,
        price
      },
      quantity,
      notes
    }
  }`;
  const ADD_TO_WISHLIST = `mutation createWishlistDetail($wishlistID: ID!, $productID: ID!){
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
  const GET_WISHLIST = `query{
    currentUserWishlist{
      id,
      name,
      option
    }
  }`;

  const updateQuantity = () => {
    GRAPHQLAPI.post(
      '',
      {
        query: UPDATE_CART_MUTATION,
        variables: {
          productID: cart.product.id,
          quantity: (document.getElementById('quantity') as HTMLInputElement)
            .value,
          notes: '',
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log('QTY Updated');
      console.log(response);
    });
  };

  const handleCheckboxChange = (event: any, w: any) => {
    setSelected(w.id);
  };

  const openModal = () => {
    setIsOpen(true);
    console.log(isOpen);
  };

  const closeModal = () => {
    setIsOpen(false);
    console.log(isOpen);
  };

  const addToWishlist = () => {
    console.log(selected);
    if (selected) {
      GRAPHQLAPI.post(
        '',
        {
          query: ADD_TO_WISHLIST,
          variables: {
            wishlistID: selected,
            productID: cart.product.id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ).then((response) => {
        console.log(response);
        closeModal();
      });
    }
  };

  useEffect(() => {
    GRAPHQLAPI.post(
      '',
      {
        query: GET_WISHLIST,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      // console.log(response);
      setWishlist(response.data.data.currentUserWishlist);
      console.log(wishlist);
    });
  }, [isOpen]);

  return (
    <div
      className={`${styles['cardItem']} ${
        isOpen ? styles['open'] : styles['']
      }`}
    >
      <div className={styles.background} onClick={closeModal}></div>
      <div
        className={`${styles.modal} ${isOpen ? styles['open'] : styles['']}`}
      >
        <p className={styles.titleManage}>Move to Wish Lists</p>
        {wishlist.map((w) => {
          return (
            <div className={styles.wishlist} key={w.id}>
              <input
                type="checkbox"
                checked={selected == w.id}
                onChange={(e) => handleCheckboxChange(e, w)}
                id={w.id}
              />
              <label htmlFor={w.id} className={styles.labelWishlist}>
                {w.name}
              </label>
            </div>
          );
        })}
        <div className={styles.btnContainer}>
          <button onClick={closeModal} className={styles.closeBTN}>
            Cancel
          </button>
          <button onClick={addToWishlist} className={styles.addBTN}>
            ADD
          </button>
        </div>
      </div>
      <div className={styles.itemContainer}>
        <img src={cart.product.images} className={styles.productImage}></img>
        <div className={styles.itemInfo}>{cart.product.name}</div>
        {/* <div className={styles.itemQuantity}>{cart.quantity}</div> */}
        <input
          type="number"
          className={styles.quantity}
          defaultValue={cart.quantity}
          min={1}
          max={cart.product.stock}
          onChange={updateQuantity}
          id="quantity"
        />
        <div className={styles.itemAction}>${cart.product.price}</div>
      </div>
      <div className={styles.itemSubContainer}>
        <div className={styles.flex}>
          <button onClick={openModal}>
            <img src="/assets/icon-heart.png" alt="" height={12} /> MOVE TO WISH
            LIST
          </button>
          <button>
            <img src="/assets/icon-save.png" alt="" height={12} /> SAVE FOR
            LATER
          </button>
        </div>
        <div className={styles.flex}>
          <button>
            <img src="/assets/icon-delete.png" alt="" height={12} /> REMOVE
          </button>
        </div>
      </div>
      {/* <div className={styles.divider}></div> */}
    </div>
  );
}
