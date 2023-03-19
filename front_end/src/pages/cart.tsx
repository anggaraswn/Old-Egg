import Navbar from '@/components/navbar';
import styles from '../styles/Cart.module.css';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import CartCard from '@/components/CartCard';
import FooterMain from '@/components/footerMain';
import SaveForLaterCart from '@/components/saveForLaterCartCard';

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

interface SaveForLater {
  product: Product;
  quantity: number;
}

export default function Cart() {
  const token = getCookie('jwt');
  const [carts, setCarts] = useState<Cart[]>([]);
  const [saveForLater, setSaveForLater] = useState<SaveForLater[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [changes, setChanges] = useState(0);
  const delivery = 0;

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

  const SAVE_FOR_LATERS_QUERY = `query{
    saveForLaters{
      user{
        id,
        firstName
      },
      product{
        id,
        name,
        images,
        price,
        stock,
        rating
      },
      quantity
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
      setTotalPrice(0);
      setCarts(response.data.data.carts);
    });

    GRAPHQLAPI.post(
      '',
      {
        query: SAVE_FOR_LATERS_QUERY,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      setSaveForLater(response.data.data.saveForLaters);
    });
  }, [changes]);

  useEffect(() => {
    carts.map((c) => {
      setTotalPrice(totalPrice + c.product.price * c.quantity);
    });
  }, [carts]);

  const handleChanges = () => {
    setChanges(changes + 1);
    console.log('in');
  };

  const handleCheckout = () => {
    window.location.href = '/checkout';
  };

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
                  return (
                    <CartCard
                      cart={c}
                      key={c.product.id}
                      handleChanges={handleChanges}
                    />
                  );
                })}
              </div>
            </div>
            <div className={styles.rowSide}>
              <div className={styles.summarySide}>
                <h3>Summary</h3>
                <div className={styles.summary}>
                  <div className={styles.summaryContent}>
                    <ul>
                      <li>
                        <label htmlFor="">Item(s): </label>
                        <span>$ {totalPrice.toFixed(2)}</span>
                      </li>
                      <li>
                        <label htmlFor="">Est. Delivery: </label>
                        <span>${delivery.toFixed(2)}</span>
                      </li>
                    </ul>
                  </div>
                  <div className={styles.divider}></div>
                  <div className={styles.addPromo}>
                    <h4 className={styles.flex}>
                      <span>Apply Promo Code</span>
                      <img src="/assets/icon-plus2.png" alt="" height={14} />
                    </h4>
                  </div>
                  <div className={styles.divider}></div>
                  <div className={styles.summaryContent}>
                    <ul>
                      <li>
                        <label htmlFor="">Est. Total:</label>
                        <span>${(delivery + totalPrice).toFixed(2)}</span>
                      </li>
                    </ul>
                    <div className={styles.summaryActions}>
                      <button onClick={handleCheckout}>SECURE CHECKOUT</button>
                      <div className={styles.others}>
                        <div className={styles.splitLine}>
                          <div className={styles.line}></div>
                          <span>OR</span>
                          <div className={styles.line}></div>
                        </div>
                        {/* <button></button> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.SFLContainer}>
            <div className={styles.SFLTop}>
              <h1>
                Saved for Later(
                <span className={styles.itemCount}>
                  {saveForLater.length} item(s)
                </span>
                )
              </h1>
            </div>
            <div className={styles.SFLBody}>
              <div className={styles.itemContainer}>
                {saveForLater.map((s) => {
                  return (
                    <SaveForLaterCart
                      SaveForLater={s}
                      handleChanges={handleChanges}
                      key={s.id}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <FooterMain />
    </div>
  );
}
