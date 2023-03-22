import Image from 'next/image';
import styles from '../styles/Login.module.css';
import Footer from '@/components/footer';
import { useState } from 'react';
import axios from 'axios';
import { setCookies } from 'cookies-next';

export default function LoginWithCode() {
  const [error, setError] = useState('');

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const VALIDATE_VERIFICATION_MUTATION = `mutation validateVerificationCode($email: String!, $verificationCode: String!){
    validateVerificationCode(email: $email, verificationCode: $verificationCode)
  }`;

  const loginUser = () => {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const verificationCode = (
      document.getElementById('code') as HTMLInputElement
    ).value;
    GRAPHQLAPI.post('', {
      query: VALIDATE_VERIFICATION_MUTATION,
      variables: {
        email: email,
        verificationCode: verificationCode,
      },
    }).then((response) => {
      console.log(response);
      if (response.data.data.validateVerificationCode.token) {
        setCookies('jwt', response.data.data.validateVerificationCode.token, {
          maxAge: 60 * 60,
        });
        setError('');
        window.location.href = '/';
      } else {
        setError('Invalid Verification Code');
      }
    });
  };

  return (
    <div className={styles.outer}>
      <div className={styles.container}>
        <Image
          src="/assets/logo.png"
          alt="Logo"
          width={130}
          height={64}
        ></Image>
        <p className={styles.title}>Sign In With Code</p>
        <div className={styles.form}>
          <label htmlFor="email">Email</label>
          <input
            type="text"
            placeholder="Input the email"
            className={styles.input}
            id="email"
          />
          <label htmlFor="code">Verification Code</label>
          <input
            type="text"
            placeholder="Input the verification code"
            className={styles.input}
            id="code"
          />
        </div>

        <button
          className={styles.button}
          id={styles['signInBTN']}
          onClick={loginUser}
        >
          SIGN IN
        </button>
        <p className={styles.error}>{error}</p>
        <Footer />
      </div>
    </div>
  );
}
