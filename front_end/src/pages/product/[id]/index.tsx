import Navbar from '@/components/navbar';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../Index.module.css';
import { getCookie } from 'cookies-next';

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

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const token = getCookie('jwt');
  const [product, setProduct] = useState<Product | null>(null);
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

  console.log(id);

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
        product{
          id,
          price
        },
        quantity
      }
    }`;
    GRAPHQLAPI.post('', {
      query: ADD_TO_CART_MUTATION,
      variables: {
        productID: id,
        quantity: parseInt(
          (document.getElementById('quantity') as HTMLInputElement).value,
        ),
        notes: '',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => {
      console.log(response);
    });
  };

  // console.log(product);
  return (
    <>
      <Navbar />
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
        </div>
      </div>
    </>
  );
}
