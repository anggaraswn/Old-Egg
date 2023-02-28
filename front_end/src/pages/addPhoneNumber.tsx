import styles from '../styles/InsertPhonenumber.module.css';
import Image from 'next/image';
import Footer from '@/components/footer';
import { useState } from 'react';
import isMobilePhone from 'validator/lib/isMobilePhone';
import Settings from './settings';
import axios from 'axios';
import { getCookie } from 'cookies-next';

export default function AddPhonenumber() {
  const token = getCookie('jwt');
  const [error, setError] = useState('');

  const save = () => {
    let phoneNumberInput = (
      document.getElementById('phoneNumber') as HTMLInputElement
    ).value;
    if (!isMobilePhone(phoneNumberInput)) {
      setError('Please input a valid phone number');
    } else {
      setError('');

      const GRAPHQLAPI = axios.create({
        baseURL: 'http://localhost:8080/query',
      });
      const UPDATE_PHONENUMBER_MUTATION = `mutation updatePhonenumber($phone: String!){
        updatePhonenumber(phone: $phone){
          id,
          phone
        }
      }`;

      GRAPHQLAPI.post(
        '',
        {
          query: UPDATE_PHONENUMBER_MUTATION,
          variables: {
            phone: phoneNumberInput,
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

      window.location.href = '/settings';
    }
  };

  const cancel = () => {
    window.location.href = '/settings';
  };

  return (
    <div className={styles.outer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={130}
            height={64}
          ></Image>
          <p className={styles.title}>Update Mobile Number</p>
          <p className={styles.text}>
            Enter the mobile phone number you would like to associate with your
            profile. We will send a One-time Code to that number.
          </p>
          <input
            type="text"
            placeholder="Phone number"
            className={styles.input}
            id="phoneNumber"
          />
          <button className={styles.yellowBtn} onClick={save}>
            SAVE
          </button>
          <button className={styles.whiteBtn} onClick={cancel}>
            CANCEL
          </button>
          <p className={styles.error}>{error}</p>
          {/* <div className={styles.inputContainer}>
            <select name="region" id="region" className={styles.select}>
              <option value="AE +971">AE +971</option>
            </select>
          </div> */}
        </div>
      </div>
      <Footer />
    </div>
  );
}
