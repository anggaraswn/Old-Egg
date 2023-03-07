import Navbar from '@/components/navbar';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '../Index.module.css';
import { getCookie } from 'cookies-next';
import FooterMain from '@/components/footerMain';

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

interface WishList {
  id: string;
  name: string;
  option: string;
}

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const token = getCookie('jwt');
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [wishlist, setWishlist] = useState<WishList[]>([]);
  const [selected, setSelected] = useState(null);
  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const GET_PRODUCT = `query product($id: ID!){
    product(id: $id){
    id,
    name,
    images,
    price,
    discount,
    rating,
    stock,
    description,
    numberOfReviews,
    numberBought
  }
  }
  `;

  const GET_WISHLIST = `query{
    currentUserWishlist{
      id,
      name,
      option
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

  const saveWishlist = () => {
    console.log(selected);
    if (selected) {
      GRAPHQLAPI.post(
        '',
        {
          query: ADD_TO_WISHLIST,
          variables: {
            wishlistID: selected,
            productID: id,
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

  // console.log(id);

  useEffect(() => {
    if (id) {
      GRAPHQLAPI.post('', {
        query: GET_PRODUCT,
        variables: {
          id: id,
        },
      })
        .then((response) => {
          console.log(response);
          setProduct(response.data.data.product);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);

  const addToCart = () => {
    const ADD_TO_CART_MUTATION = `mutation createCart($productID: ID!, $quantity: Int!, $notes: String!){
      createCart(input:{
        productID: $productID,
        quantity: $quantity,
        notes: $notes
      }){
        quantity
      }
    }`;
    // console.log(id);
    // console.log(
    //   parseInt((document.getElementById('quantity') as HTMLInputElement).value),
    // );
    let notes = '';
    GRAPHQLAPI.post(
      '',
      {
        query: ADD_TO_CART_MUTATION,
        variables: {
          productID: id,
          quantity: parseInt(
            (document.getElementById('quantity') as HTMLInputElement).value,
          ),
          notes: notes,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      if (!response.data.data.createCart) {
        setError('Invalid quantity');
      }
    });
  };

  // console.log(product);
  return (
    <div
      className={`${styles['body']} ${isOpen ? styles['open'] : styles['']}`}
    >
      <Navbar />
      <div className={styles.background} onClick={closeModal}></div>
      <div
        className={`${styles.modal} ${isOpen ? styles['open'] : styles['']}`}
      >
        <p className={styles.titleManage}>Manage Wish Lists</p>
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
        <div className={styles.saveBTNContainer}>
          <button onClick={saveWishlist}>Save</button>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.left_left}>
            <img
              src={product?.images}
              alt="Product Image"
              height={228}
              width={304}
            ></img>
          </div>
          <div className={styles.left_right}>
            <div className={styles.title}>
              <p>{product?.name}</p>
              <p>{product?.description}</p>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          {product?.stock == 0 ? (
            <div className={styles.soldOut}>Sold Out</div>
          ) : (
            <></>
          )}
          <p>${product?.price}</p>
          <div className={styles.addToCartContainer}>
            <div className={styles.inputQtyContainer}>
              <input
                type="number"
                className={styles.quantity}
                min={1}
                // value={1}
                defaultValue={1}
                max={product?.stock}
                id="quantity"
              />
              {/* <div className={styles.addMinusContainer}>
                <button>+</button>
                <button>-</button>
              </div> */}
              <button className={styles.addToCartBTN} onClick={addToCart}>
                ADD TO CART
              </button>
            </div>
          </div>
          <p className={styles.error}>{error}</p>
          <div className={styles.line}></div>
          <div className={styles.addToFavorites}>
            <a href="#" onClick={openModal}>
              <img
                className={styles.iconHeart}
                src="/assets/icon-heart.png"
                alt="Icon Heart"
              />
              ADD TO LIST
            </a>
          </div>
        </div>
      </div>
      <FooterMain />
    </div>
  );
}
