import Navbar from '@/components/navbar';
import axios from 'axios';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from '../Index.module.css';

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

  console.log(product);
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
        </div>
      </div>
    </>
  );
}
