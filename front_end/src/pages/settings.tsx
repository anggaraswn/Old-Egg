import Navbar from '@/components/navbar';
import styles from '../styles/Settings.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  subscribe: boolean;
  banned: boolean;
}

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);

  const token = getCookie('jwt');

  let res = null;

  const GET_CURRENT_USER = `
  query{
    getCurrentUser{
      id,
      firstName,
      lastName,
      email,
      phone,
      password,
      subscribe,
      banned,
      role
    }
  }
  `;

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });

  useEffect(() => {
    GRAPHQLAPI.post(
      '',
      {
        query: GET_CURRENT_USER,
        // headers: headers,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      res = response.data.data.getCurrentUser;
      console.log(res);
      setUser(res);
      console.log(user);
    });
  }, [token]);

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.title}>
            HI, {user?.firstName}&nbsp;{user?.lastName}
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.title}>ACCOUNT SETTINGS</div>
          <div className={styles.text}>
            Control, protect, and secure your account.
          </div>
          <div className={styles.tbody}>
            <div className={styles.block}>
              <p className={styles.text}>Account Information</p>
              <div className={styles.val}>
                <p>
                  {user?.firstName}&nbsp;{user?.lastName}
                </p>
                <p>{user?.email}</p>
                <p>Display as Anonymous</p>
              </div>
              <button className={styles.btn}>Edit</button>
            </div>
            <div className={styles.block}>
              <p className={styles.text}>Mobile Number</p>
              <div className={styles.val}>
                <p></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
