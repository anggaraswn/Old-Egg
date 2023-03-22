import axios from 'axios';
import { useState } from 'react';
import styles from '../styles/Login.module.css';
import { setCookies } from 'cookies-next';
import Image from 'next/image';
import Footer from '@/components/footer';
import emailjs from 'emailjs-com';

export default function ForgotPassword() {
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [emailAddress, setEmailAddress] = useState('');

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const VALIDATE_VERIFICATION_MUTATION = `mutation validateVerificationCode($email: String!, $verificationCode: String!){
    validateVerificationCode(email: $email, verificationCode: $verificationCode)
  }`;
  const VALIDATE_EMAIL_MUTATION = `mutation validateEmail($email: String!){
    validateEmail(email: $email)
  }`;
  const INSERT_VERIFICATION_MUTATION = `mutation insertVerificationCode($email: String! ,$verificationCode: String!, $duration: Int!){
    insertVerificationCode(email: $email, verificationCode: $verificationCode, duration: $duration){
      id,
      verificationCode,
      verificationCodeValid
    }
  }`;

  const handleVerification = () => {
    const verificationCode = (
      document.getElementById('code') as HTMLInputElement
    ).value;
    GRAPHQLAPI.post('', {
      query: VALIDATE_VERIFICATION_MUTATION,
      variables: {
        email: emailAddress,
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

  const handleRequest = () => {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    setEmailAddress(email);
    if (!email) {
      setError('Please fill the field');
    } else {
      setError('');
      GRAPHQLAPI.post('', {
        query: VALIDATE_EMAIL_MUTATION,
        variables: {
          email: email,
        },
      }).then((response) => {
        console.log(response);
        if (response.data.data.validateEmail == false) {
          setError("Email hasn't registered yet!");
        } else {
          const { v1 } = require('uuid');
          const verificationCode = v1().slice(0, 6);
          // console.log(verificationCode);
          GRAPHQLAPI.post('', {
            query: INSERT_VERIFICATION_MUTATION,
            variables: {
              email: email,
              verificationCode: verificationCode,
              duration: 5,
            },
          }).then((response) => {
            console.log(response);
            // const message = {
            //   from_name: 'NewEgg',
            //   message: `Your verification code is: ${verificationCode}`,
            // };
            // emailjs
            //   .send(
            //     'service_f6grouv',
            //     'template_hhticgf',
            //     message,
            //     'YxdxE8wQhw9aHzbgE',
            //   )
            //   .then(
            //     (response) => {
            //       console.log(response);
            //       setStep(2);
            //     },
            //     (error) => {
            //       console.log(error);
            //     },
            //   );
          });
        }
      });
    }
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
        <p className={styles.title}>Forgot Password</p>
        {step == 1 ? (
          <div className={styles.step1}>
            <div className={styles.form}>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                placeholder="Input the email"
                className={styles.input}
                id="email"
              />
            </div>
            <div className={styles.center}>
              <button
                className={styles.button}
                id={styles['signInBTN']}
                onClick={handleRequest}
              >
                REQUEST VERIFICATION CODE
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className={styles.form}>
              <label htmlFor="code">Verification Code</label>
              <input
                type="text"
                placeholder="Input the verification code"
                className={styles.input}
                id="code"
                defaultValue={''}
              />
            </div>
            <div className={styles.center}>
              <button
                className={styles.button}
                id={styles['signInBTN']}
                onClick={handleVerification}
              >
                SUBMIT
              </button>
            </div>
          </div>
        )}

        <p className={styles.error}>{error}</p>
        <Footer />
      </div>
    </div>
  );
}
