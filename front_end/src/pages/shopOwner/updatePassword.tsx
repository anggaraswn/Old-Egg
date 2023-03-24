import Footer from '@/components/footer';
import Image from 'next/image';
import styles from './UpdatePassword.module.css';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import axios from 'axios';

export default function UpdatePasswordShop() {
  const token = getCookie('jwt');
  const [error, setError] = useState('');

  const saveChanges = () => {
    let passwordPattern = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/,
    );
    let currPassword = (
      document.getElementById('currPassword') as HTMLInputElement
    ).value;

    let newPassword = (
      document.getElementById('newPassword') as HTMLInputElement
    ).value;

    if (!currPassword || !newPassword) {
      setError('All field must be field');
    } else if (!passwordPattern.test(newPassword)) {
      setError('New password is invalid');
    } else {
      const GRAPHQLAPI = axios.create({
        baseURL: 'http://localhost:8080/query',
      });

      const UPDATE_PASSWORD_MUTATION = `mutation updatePassword($currentPassword: String!, $newPassword: String!){
        updatePassword(currentPassword: $currentPassword, newPassword: $newPassword){
          id
        }
      }`;

      GRAPHQLAPI.post(
        '',
        {
          query: UPDATE_PASSWORD_MUTATION,
          variables: {
            currentPassword: currPassword,
            newPassword: newPassword,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
        .then((response) => {
          console.log(response);
          if (response.data.data.updatePassword) {
            setError('');
            window.location.href = '/shopOwner/';
          } else {
            setError('Current password does not match');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
          <p className={styles.title}>Change Your Password</p>
          <input
            type="password"
            placeholder="Current Password"
            className={styles.input}
            id="currPassword"
          />
          <input
            type="password"
            placeholder="New Password"
            className={styles.input}
            id="newPassword"
          />
          <p className={styles.error}>{error}</p>
          <button className={styles.yellowBtn} onClick={saveChanges}>
            SAVE CHANGES
          </button>
          <p>
            Need Help?{''}
            <span>
              <a href="">Contact Customer Service</a>
            </span>
          </p>
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
