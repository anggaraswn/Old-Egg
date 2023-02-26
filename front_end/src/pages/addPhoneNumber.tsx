import styles from '../styles/InsertPhonenumber.module.css';
import Image from 'next/image';
import Footer from '@/components/footer';
import { useState } from 'react';
import isMobilePhone from 'validator/lib/isMobilePhone';
import Settings from './settings';

export default function AddPhonenumber() {
  const [error, setError] = useState('');

  const save = () => {
    let phoneNumberInput = (
      document.getElementById('phoneNumber') as HTMLInputElement
    ).value;
    if (!isMobilePhone(phoneNumberInput)) {
      setError('Please input a valid phone number');
    } else {
      setError('');
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
          <p className={styles.title}>Add Mobile Number</p>
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
