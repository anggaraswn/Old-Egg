import Navbar from '@/components/navbar';
import styles from '../styles/Settings.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { Link } from 'react-router-dom';
import FooterMain from '@/components/footerMain';

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
  const [checked, setChecked] = useState(false);
  let res = null;

  const addPhoneNumber = () => {
    window.location.href = '/addPhoneNumber';
  };

  const changePassword = () => {
    window.location.href = '/changePassword';
  };

  const handleCheckboxChange = (event: any) => {
    setChecked(event.target.checked);
  };

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
      role,
      TwoFA
    }
  }
  `;

  const UPDATE_2FA_MUTATION = `mutation updateTwoFA($twoFA: Boolean!){
    updateTwoFA(twoFA: $twoFA){
      id,
      firstName,
      lastName,
      email,
      TwoFA
    }
  }`;

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
      setChecked(response.data.data.getCurrentUser.TwoFA);
      console.log(user);
    });
  }, [token]);

  useEffect(() => {
    GRAPHQLAPI.post(
      '',
      {
        query: UPDATE_2FA_MUTATION,
        variables: {
          twoFA: checked,
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
  }, [checked]);

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
              <p className={`${styles['text']} ${styles['point']}`}>
                Account Information
              </p>
              <div className={styles.val}>
                <p>
                  {user?.firstName}&nbsp;{user?.lastName}
                </p>
                <p>{user?.email}</p>
                <p>Display as Anonymous</p>
              </div>
              <button className={styles.btn}>Edit</button>
            </div>
            {user?.phone ? (
              <div className={styles.block}>
                <p className={`${styles['text']} ${styles['point']}`}>
                  Mobile Number
                </p>
                <div className={styles.val}>
                  <p>{user?.phone}</p>
                </div>
                <button className={styles.btn} onClick={addPhoneNumber}>
                  Edit
                </button>
              </div>
            ) : (
              <div className={styles.block}>
                <p className={`${styles['text']} ${styles['point']}`}>
                  Mobile Number
                </p>
                <div className={styles.val}>
                  <p>
                    To enhance your account security, add your mobile number.
                  </p>
                </div>
                <button className={styles.btn} onClick={addPhoneNumber}>
                  Add
                </button>
              </div>
            )}
            <div className={styles.block}>
              <p className={`${styles['text']} ${styles['point']}`}>Password</p>
              <div className={styles.val}>********</div>
              <button className={styles.btn} onClick={changePassword}>
                Edit
              </button>
            </div>
            <div className={styles.block}>
              <p className={`${styles['text']} ${styles['point']}`}>2FA</p>
              <input
                type="checkbox"
                checked={checked}
                onChange={handleCheckboxChange}
              />
            </div>
          </div>
          <div className={styles.text} style={{ fontSize: '13px' }}>
            Newegg is the sole owner of the information collected on this site.
            We will not sell, share, or rent this information to any outside
            parties, except as outlined in the privacy policy.
          </div>
        </div>
      </div>
      <FooterMain />
    </div>
  );
}
