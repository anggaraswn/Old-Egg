import { useEffect, useState } from 'react';
import styles from './InsertShop.module.css';
import axios from 'axios';
import { getCookie } from 'cookies-next';

export default function InsertShop() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const token = getCookie('jwt');
  const [user, setUser] = useState([]);
  const INSERT_SHOP_MUTATION = `mutation createShop($name: String!, $image: String!, $banner: String!, $policy:String!, $aboutUs:String!, $userID: ID!){
    createShop(input: {
      name: $name,
      image: $image,
      banner: $banner,
      policy: $policy,
      aboutUs: $aboutUs,
      userID: $userID
    }){
      id,
      name,
      user{
        id,
        firstName,
        lastName
      }
    }
  }`;
  const INSERT_USER_MUTATION = `mutation createUser(
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
        password: $password
        subscribe: $subscribe
        banned: $banned
        role: $role
      }
      phone: $phone
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
}`;

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });

  const generatePassword = () => {
    setName((document.getElementById('name') as HTMLInputElement).value);
    console.log(name);
  };

  useEffect(() => {
    if (name != '') {
      (document.getElementById('password') as HTMLInputElement).value =
        name + '123456';
    }
  }, [name]);

  const handleInsert = () => {
    setEmail((document.getElementById('email') as HTMLInputElement).value);
    setPassword(
      (document.getElementById('password') as HTMLInputElement).value,
    );
    GRAPHQLAPI.post('', {
      query: INSERT_USER_MUTATION,
      variables: {
        firstName: name,
        lastName: name,
        email: email,
        phone: '',
        password: password,
        subscribe: false,
        banned: false,
        role: 'SHOP',
      },
    }).then((response) => {
      console.log(response.data.data.createUser);
      const userID = response.data.data.createUser.id;
      console.log(userID);
      GRAPHQLAPI.post('', {
        query: INSERT_SHOP_MUTATION,
        variables: {
          name: name,
          userID: userID,
        },
      });
    });
  };

  return (
    <div>
      <div className={styles.title}>Insert Shop</div>
      <div className={styles.form}>
        <div className={styles.group}>
          <label htmlFor="name">Shop Name</label>
          <input type="text" id="name" />
        </div>
        <div className={styles.group}>
          <label htmlFor="email">Shop Email</label>
          <input type="email" id="email" />
        </div>
        <button onClick={generatePassword} className={styles.orangeBTN}>
          Generate Password
        </button>
        <div className={styles.group}>
          <label htmlFor="password">Shop Pass</label>
          <input type="text" id="password" />
        </div>
        <button className={styles.orangeBTN} onClick={handleInsert}>
          Insert Now
        </button>
      </div>
    </div>
  );
}
