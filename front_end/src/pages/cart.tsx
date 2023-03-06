import Navbar from '@/components/navbar';
import styles from '../styles/Cart.module.css';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import CartCard from '@/components/CartCard';

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

export default function Cart() {
  const token = getCookie('jwt');
  const [carts, setCarts] = useState<Cart[]>([]);

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const CARTS_QUERY = `query{
    carts{
      product{
        id,
        name,
        images,
        price,
        discount,
        rating,
        stock,
        description,
      },
      quantity,
      notes
    }
  }`;

  useEffect(() => {
    GRAPHQLAPI.post(
      '',
      {
        query: CARTS_QUERY,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      setCarts(response.data.data.carts);
    });
  }, [token]);

  return (
    <div className={styles.body}>
      <Navbar />
      <div className={styles.pageSectionInner}>
        <div className={styles.shoppingCart}>
          <div className={styles.cartTop}>
            <div className={styles.topLeft}>
              <h1>
                Shopping Cart (
                <span className={styles.itemCount}>{carts.length} item(s)</span>
                )
              </h1>
            </div>
          </div>
          <div className={styles.inner}>
            <div className={styles.rowBody}>
              <div className={styles.itemContainer}>
                {carts.map((c) => {
                  return <CartCard cart={c} />;
                })}
              </div>
            </div>
            <div className={styles.rowSide}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
