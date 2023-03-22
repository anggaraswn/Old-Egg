import Image from 'next/image';
import styles from '../styles/Login.module.css';
import Footer from '@/components/footer';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { setCookies } from 'cookies-next';
import emailjs from 'emailjs-com';

const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
const LOGIN_MUTATION = `mutation login($email: String!, $password: String!){
  auth {
        login(email: $email, password: $password)
      }
}`;

export default function Login() {
  const [errorMsg, setErrorMsg] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
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

  const loginUser = () => {
    let emailInput = (document.getElementById('email') as HTMLInputElement)
      .value;
    let passwordInput = (
      document.getElementById('password') as HTMLInputElement
    ).value;
    console.log(emailInput);
    console.log(passwordInput);
    if (!emailInput || !passwordInput) {
      setErrorMsg('All fields must be filled!');
    } else {
      console.log('Test');

      GRAPHQLAPI.post('', {
        query: LOGIN_MUTATION,
        variables: {
          email: emailInput,
          password: passwordInput,
        },
      })
        .then((response) => {
          console.log(response);
          // const test = response.data.data.auth.login.token;
          if (response.data.data.auth.login) {
            // if(response.data.data.auth.login)
            setCookies('jwt', response.data.data.auth.login.token, {
              maxAge: 60 * 60,
            });
            console.log(response.data.data.auth.login.token);
            setToken(response.data.data.auth.login.token);
            setErrorMsg('');
            // window.location.href = '/';
          }
          // console.log(test);
        })
        .catch((err) => {
          setErrorMsg('Invalid credential!');
          console.log(err);
        });
    }
  };

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
    )
      .then((response) => {
        console.log(response);
        if (response.data.data.getCurrentUser.banned == false) {
          console.log(response.data.data.getCurrentUser);
          if (response.data.data.getCurrentUser.role === 'USER') {
            window.location.href = '/';
          } else if (response.data.data.getCurrentUser.role === 'ADMIN') {
            // console.log('in');
            window.location.href = '/admin';
          } else {
            window.location.href = '/seller';
          }
        } else {
          setErrorMsg('Your account is banned!');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

  const handleSignByCode = () => {
    const email = (document.getElementById('email') as HTMLInputElement).value;
    GRAPHQLAPI.post('', {
      query: VALIDATE_EMAIL_MUTATION,
      variables: {
        email: email,
      },
    }).then((response) => {
      console.log(response);
      if (response.data.data.validateEmail == true) {
        const { v1 } = require('uuid');
        const verificationCode = v1().slice(0, 6);
        // console.log(verificationCode);
        GRAPHQLAPI.post('', {
          query: INSERT_VERIFICATION_MUTATION,
          variables: {
            email: email,
            verificationCode: verificationCode,
            duration: 15,
          },
        }).then((response) => {
          console.log(response);
          const message = {
            from_name: 'NewEgg',
            message: `Your verification code is: ${verificationCode}`,
          };
          emailjs
            .send(
              'service_f6grouv',
              'template_hhticgf',
              message,
              'YxdxE8wQhw9aHzbgE',
            )
            .then(
              (response) => {
                console.log(response);
                window.location.href = '/loginWithCode';
              },
              (error) => {
                console.log(error);
              },
            );
        });
      } else {
        setError('Please enter a valid email');
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
        {/* <img src="/assets/logo.png" alt="Logo" width={100} height={100}></img> */}
        <p>Sign In</p>
        <input
          type="text"
          placeholder="Email Address"
          className={styles.input}
          id="email"
        />
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          id="password"
        />
        <button
          className={styles.button}
          id={styles['signInBTN']}
          onClick={loginUser}
        >
          SIGN IN
        </button>
        <p className={styles.error}>{errorMsg}</p>
        <button className={styles.button} onClick={handleSignByCode}>
          GET ONE-TIME SIGN IN CODE
        </button>
        <p className={styles.error}>{error}</p>
        <div className={styles.black}>
          <div className={styles.center}>
            <a href="">What's the One-Time Code?</a>
          </div>
          <div className={styles.signUp}>
            <p>New to Newegg?</p>
            <a href="/registers" className={styles.signUpLink}>
              Sign Up
            </a>
          </div>
          <div className={styles.center}>
            <a href="/forgotPassword">Forgot Password?</a>
          </div>
        </div>
        <button className={styles.button}>
          <Image
            src="/assets/icon-google.png"
            alt=""
            width={20}
            height={20}
          ></Image>
          <span>SIGN IN WITH GOOGLE</span>
        </button>
        <button className={styles.button}>
          <Image
            src={'/assets/icon-apple.png'}
            alt=""
            width={20}
            height={20}
          ></Image>
          <span>SIGN IN WITH APPLE</span>
        </button>
      </div>
      <Footer />
    </div>
  );
}
