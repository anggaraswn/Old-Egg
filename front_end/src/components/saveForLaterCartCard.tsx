import { getCookie } from 'cookies-next';
import styles from './saveForLaterCartCard.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface WishList {
  id: string;
  name: string;
  option: string;
}

export default function SaveForLaterCart(props: {
  SaveForLater: any;
  handleChanges: Function;
}) {
  const { SaveForLater, handleChanges } = props;
  const token = getCookie('jwt');
  const [isOpen, setIsOpen] = useState(false);
  const [wishlist, setWishlist] = useState<WishList[]>([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');

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
  const REMOVE_CART_MUTATION = `mutation deleteCart($productID: ID!){
  deleteCart(productID: $productID){
    user{
      firstName
    },
    product{
      name
    }
  }
}`;

  const MOVE_TO_CART_MUTATION = `mutation createCart($productID: ID!, $quantity: Int!, $notes: String!){
  createCart(input:{
    productID: $productID,
    quantity: $quantity,
    notes: $notes
  }){
    quantity
  }
}`;

  // const updateQuantity = () => {
  //   GRAPHQLAPI.post(
  //     '',
  //     {
  //       query: UPDATE_CART_MUTATION,
  //       variables: {
  //         productID: cart.product.id,
  //         quantity: (document.getElementById('quantity') as HTMLInputElement)
  //           .value,
  //         notes: '',
  //       },
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     },
  //   ).then((response) => {
  //     console.log('QTY Updated');
  //     console.log(response);
  //     handleChanges();
  //   });
  // };

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
            productID: SaveForLater.product.id,
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

  const handleRemoveItem = () => {
    GRAPHQLAPI.post(
      '',
      {
        query: REMOVE_CART_MUTATION,
        variables: {
          productID: SaveForLater.product.id,
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

  const handleMoveToCart = () => {
    console.log(SaveForLater.product.id);
    console.log(SaveForLater.quantity);
    GRAPHQLAPI.post(
      '',
      {
        query: MOVE_TO_CART_MUTATION,
        variables: {
          productID: SaveForLater.product.id,
          quantity: SaveForLater.quantity,
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
      handleChanges();
      if (!response.data.data.createCart) {
        setError('Invalid quantity');
      }
    });
  };

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
        <img
          src={SaveForLater.product.images}
          className={styles.productImage}
        ></img>
        <div className={styles.itemInfo}>{SaveForLater.product.name}</div>
        {/* <div className={styles.itemQuantity}>{cart.quantity}</div> */}
        <div className={styles.qtyPriceContainer}>
          <div>{SaveForLater.quantity}</div>
          {/* <input
            type="number"
            className={styles.quantity}
            defaultValue={SaveForLater.quantity}
            min={1}
            max={SaveForLater.product.stock}
            // onChange={updateQuantity}
            id="quantity"
          /> */}
          <div className={styles.itemAction}>${SaveForLater.product.price}</div>
        </div>
      </div>
      <div className={styles.itemSubContainer}>
        <div className={styles.flex}>
          <button onClick={openModal}>
            <img src="/assets/icon-heart.png" alt="" height={12} /> MOVE TO WISH
            LIST
          </button>
          <button onClick={handleMoveToCart}>
            <img src="/assets/icon-cart.png" alt="" height={12} /> Move To Cart
          </button>
        </div>
        <div className={styles.flex}>
          <button onClick={handleRemoveItem}>
            <img src="/assets/icon-delete.png" alt="" height={12} /> REMOVE
          </button>
        </div>
      </div>
      {/* <div className={styles.divider}></div> */}
    </div>
  );
}
