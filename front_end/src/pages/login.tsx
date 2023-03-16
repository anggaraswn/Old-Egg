import Image from 'next/image';
import styles from '../styles/Login.module.css';
import Footer from '@/components/footer';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { setCookies } from 'cookies-next';

const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
const LOGIN_MUTATION = `mutation login($email: String!, $password: String!){
  auth {
        login(email: $email, password: $password)
      }
}`;

export default function Login() {
  const [errorMsg, setErrorMsg] = useState('');
  const [token, setToken] = useState('');
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
          window.location.href = '/';
        } else {
          setErrorMsg('Your account is banned!');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token]);

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
        <button className={styles.button}>GET ONE-TIME SIGN IN CODE</button>
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
