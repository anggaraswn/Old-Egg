import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
import styles from './MyOrder.module.css';
import axios from 'axios';

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

interface TransactionDetail {
  product: Product;
  quantity: number;
}

interface TransactionHeader {
  id: string;
  transactionDate: string;
  transactionDetails: TransactionDetail[];
  invoice: string;
  status: string;
}

export default function MyOrder() {
  const token = getCookie('jwt');
  const [orders, setOrder] = useState<TransactionHeader[]>([]);
  const [filterBy, setFilterBy] = useState('all');
  const [changes, setChanges] = useState(0);

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const GET_ORDERS = `query shopOrders($filter: String){
    shopOrders(filter: $filter){
      id,
      transactionDate,
      transactionDetails{
        product{
          id,
          name,
          price,
          shop{
            id,
            name,
          }
        },
        quantity
      },
      paymentType{
        id,
        name
      },
      address{
        id,
        addressAs
      },
      status,
      invoice,
      delivery{
        id,
        name
      }
    }
  }`;

  const UPDATE_STATUS_MUTATION = `mutation($transactionHeaderID: ID!, $status: String!, ){
    updateTransactionHeader(transactionHeaderID: $transactionHeaderID,status: $status){
      id,
      transactionDate,
      status
    }
  }`;

  useEffect(() => {
    GRAPHQLAPI.post(
      '',
      {
        query: GET_ORDERS,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      setOrder(response.data.data.shopOrders);
    });
  }, []);

  useEffect(() => {
    GRAPHQLAPI.post(
      '',
      {
        query: GET_ORDERS,
        variables: {
          filter: filterBy,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      setOrder(response.data.data.shopOrders);
    });
  }, [filterBy, changes]);

  const handleFinish = (transaction: TransactionHeader) => {
    GRAPHQLAPI.post('', {
      query: UPDATE_STATUS_MUTATION,
      variables: {
        transactionHeaderID: transaction.id,
        status: 'Finished',
      },
    }).then((response) => {
      console.log(response);
      setChanges(changes + 1);
    });
  };

  return (
    <div>
      <Navbar />
      <div className={styles.content}>
        <h1>Order</h1>
        <div className={styles.sortByContainer}>
          <span>Filter By: </span>
          <select
            value={filterBy}
            onChange={(event) => {
              setFilterBy(event.target.value);
            }}
            className={styles.selectstyle}
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className={styles.transactionsContainer}>
          {orders?.length == 0 ? (
            <div>You Haven't Had Any Order Yet</div>
          ) : (
            <div>
              {orders?.map((t) => {
                return (
                  <div key={t.id} className={styles.container}>
                    <div>
                      <div>Invoice:{t.invoice}</div>
                      <div>
                        Transaction Date:{' '}
                        {new Date(t.transactionDate).toDateString()}
                      </div>
                      <div>Order ID: {t.id}</div>
                      <div>Status: {t.status}</div>
                    </div>
                    <div>
                      <button onClick={() => handleFinish(t)}>Finish</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <FooterMain />
    </div>
  );
}
