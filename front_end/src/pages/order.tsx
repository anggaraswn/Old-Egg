import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import styles from '../styles/Order.module.css';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';
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

export default function Order() {
  const token = getCookie('jwt');
  const [transactions, setTransactions] = useState<TransactionHeader[]>([]);
  const [orderBy, setOrderBy] = useState('-1');
  const [filterBy, setFilterBy] = useState('all');
  const [search, setSearch] = useState('');

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const GET_ORDERS = `query currentUserTransactionHeaders($orderStatus: String, $ordersByDay: Int, $search: String){
    currentUserTransactionHeaders(orderStatus: $orderStatus, ordersByDay: $ordersByDay, search: $search){
      id,
      transactionDate,
      transactionDetails{
        product{
          id,
          name,
          price,
          images
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

  const MOVE_TO_CART_MUTATION = `mutation createCart($productID: ID!, $quantity: Int!, $notes: String!){
    createCart(input:{
      productID: $productID,
      quantity: $quantity,
      notes: $notes
    }){
      quantity
    }
  }`;

  useEffect(() => {
    GRAPHQLAPI.post(
      '',
      {
        query: GET_ORDERS,
        variables: {
          // orderStatus: filterBy,
          // ordersByDay: orderBy,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      setTransactions(response.data.data.currentUserTransactionHeaders);
    });
  }, []);

  useEffect(() => {
    GRAPHQLAPI.post(
      '',
      {
        query: GET_ORDERS,
        variables: {
          orderStatus: filterBy,
          ordersByDay: orderBy,
          search: search,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      setTransactions(response.data.data.currentUserTransactionHeaders);
    });
  }, [orderBy, filterBy, search]);

  const handleSearch = (event: any) => {
    console.log(event.target.value);
    setSearch(event.target.value);
  };

  const handleOrder = (product: Product) => {
    GRAPHQLAPI.post(
      '',
      {
        query: MOVE_TO_CART_MUTATION,
        variables: {
          productID: product.id,
          quantity: 1,
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
        <div className={styles.sortByContainer}>
          <span>Order By: </span>
          <select
            value={orderBy}
            onChange={(event) => {
              setOrderBy(event.target.value);
            }}
            className={styles.selectstyle}
          >
            <option value="7">Recent Orders</option>
            <option value="30">30 Days</option>
            <option value="90">90 Days</option>
            <option value="-1">All</option>
          </select>
        </div>
        <div className={styles.search}>
          <input
            type="text"
            className={styles.input}
            value={search}
            onChange={handleSearch}
          />
        </div>
        <div className={styles.transactionsContainer}>
          {transactions?.length == 0 ? (
            <div>You Haven't Had Any Order Yet</div>
          ) : (
            <div>
              {transactions?.map((t) => {
                return (
                  <div key={t.id} className={styles.container}>
                    <div>Invoice:{t.invoice}</div>
                    <div>
                      Transaction Date:{' '}
                      {new Date(t.transactionDate).toDateString()}
                    </div>
                    <div>Order ID: {t.id}</div>
                    <hr />
                    {t.transactionDetails.map((td) => {
                      return (
                        <div
                          key={td.product.id}
                          className={styles.productContainer}
                        >
                          <img
                            src={td.product.images}
                            alt="Product Image"
                            className={styles.productImage}
                          />
                          <div className={styles.productInfo}>
                            <div>{td.product.name}</div>
                            <div>Price (1 pcs):{td.product.price}</div>
                            <div>Quantity: {td.quantity}x</div>
                            <button onClick={() => handleOrder(td.product)}>
                              Order Again
                            </button>
                          </div>
                        </div>
                      );
                    })}
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
