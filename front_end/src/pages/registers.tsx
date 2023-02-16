import styles from '../styles/Register.module.css';
import Image from 'next/image';
import Footer from '@/components/footer';
import { useState } from 'react';
import axios from 'axios';
import { gql } from 'graphql-tag';

const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
// const CREATE_USER_MUTATION = gql`
//   mutation createUser($input: NewUser!) # {
//   #   firstName: "test"
//   #   lastName: "Test"
//   #   email: "test@mail.com"
//   #   phone: "123456"
//   #   password: "test123"
//   #   subscribe: true
//   #   banned: false
//   #   role: USER
//   # }
//   {
//     id
//   }
// `;
// const CREATE_USER_MUTATION = gql`
//   mutation createUser($input: NewUser!) {
//     createUser(input: $input) {
//       id
//     }
//   }
// `;

const CREATE_USER_MUTATION = `
  mutation createUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $phone: String!
    $password: String!
    $subscribe: Boolean!
    $banned: Boolean!
    $role: UserRole!
  ) {
    createUser(
      input: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        phone: $phone
        password: $password
        subscribe: $subscribe
        banned: $banned
        role: $role
      }
    ) {
      id
      firstName
      lastName
      email
      phone
      password
      subscribe
      banned
      role
    }
  }
`;

export default function Register() {
  const [errorMsg, setErrorMsg] = useState('');
  const handleSignUp = () => {
    let firstNameInput = (
      document.getElementById('firstName') as HTMLInputElement
    ).value;
    let lastNameInput = (
      document.getElementById('lastName') as HTMLInputElement
    ).value;
    let emailInput = (document.getElementById('email') as HTMLInputElement)
      .value;
    let phoneInput = (document.getElementById('phone') as HTMLInputElement)
      .value;
    let passwordInput = (
      document.getElementById('password') as HTMLInputElement
    ).value;
    let checkbox = (document.getElementById('checkbox') as HTMLInputElement)
      .checked;
    console.log(checkbox);

    let emailPattern = new RegExp(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/);
    let phoneNumberPattern = new RegExp(/^-?\d*\.?\d+$/);
    let passwordPattern = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/,
    );

    // console.log(!phoneNumberPattern.test(phone));
    // console.log(!passwordPattern.test(password));

    if (
      !firstNameInput ||
      !lastNameInput ||
      !emailInput ||
      !phoneInput ||
      !passwordInput
    ) {
      setErrorMsg('All field must be filled!');
    } else if (!emailPattern.test(emailInput)) {
      setErrorMsg('Email must be a valid email');
    } else if (!phoneNumberPattern.test(phoneInput)) {
      setErrorMsg('Phone number must be a valid phone number');
    } else if (!passwordPattern.test(passwordInput)) {
      setErrorMsg('Password must be a valid password');
    } else {
      setErrorMsg('');

      // const userInput = {
      //   firstName: firstNameInput,
      //   lastName: lastNameInput,
      //   email: emailInput,
      //   phone: phoneInput,
      //   password: passwordInput,
      //   subscribe: checkbox,
      //   banned: false,
      //   role: 'USER',
      // };

      GRAPHQLAPI.post('', {
        query: CREATE_USER_MUTATION,
        variables: {
          firstName: firstNameInput,
          lastName: lastNameInput,
          email: emailInput,
          phone: phoneInput,
          password: passwordInput,
          subscribe: checkbox,
          banned: false,
          role: 'USER',
        },
      })
        .then((response) => {
          console.log(response);
          const test = response.data.data.createUser;
          console.log(test);
        })
        .catch((err) => {
          console.log('ERROR');
          console.log(err.error);
        });

      window.location.href = '/';
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
        <p>Create Account</p>
        <div>
          <p>Shopping for your business</p>
          <a>Create a free business account</a>
        </div>
        <input
          type="text"
          placeholder="First Name"
          className={styles.input}
          id="firstName"
        ></input>
        <input
          type="text"
          placeholder="Last Name"
          className={styles.input}
          id="lastName"
        ></input>
        <input
          type="text"
          placeholder="Email Address"
          className={styles.input}
          id="email"
        ></input>
        <input
          type="text"
          placeholder="Mobine Phone Number (optional)"
          className={styles.input}
          id="phone"
        ></input>
        <input
          type="password"
          placeholder="Password"
          className={styles.input}
          id="password"
        ></input>
        <div className={styles.checkbox}>
          <input type="checkbox" id="checkbox"></input>
          <p>Subscribe for exlusive e-mail offers and discounts</p>
        </div>
        <div className={styles.desc}>
          By creating an account, you aggree to Newegg's
          <div className={styles.privacy}>
            <a href="">Privacy Notice</a>
            &nbsp;and&nbsp;
            <a href="">Terms of Use</a>
          </div>
        </div>
        <button className={styles.button} onClick={handleSignUp}>
          SIGN UP
        </button>
        <p className={styles.error}>{errorMsg}</p>
        <div className={styles.signIn}>
          <p>Have an account?</p>
          <a href="/login">Sign In</a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
