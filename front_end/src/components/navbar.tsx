import Image from 'next/image';
import styles from './Navbar.module.css';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const token = getCookie('jwt');
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState('');
  let res: any = null;

  // console.log(token);

  useEffect(() => {
    if (token) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [token]);

  if (auth) {
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

    // const headers = {
    //   Authorization: `Bearer ${token}`,
    // };

    const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
    // console.log(res);

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
      // console.log(response);
      res = response;
      // console.log(res?.data.data.getCurrentUser);
      // console.log(res?.data.data.getCurrentUser.firstName);
      setUser(res?.data.data.getCurrentUser.firstName);
    });
  }

  return (
    <div className={styles.navbar}>
      <div className={styles.top}>
        <div className={styles.left}>
          <Image
            src="/assets/icon-hamburger.png"
            alt="Hamburger Icon"
            width={28}
            height={28}
          ></Image>
          <Image
            src="/assets/logo.png"
            alt="NewEgg Icon"
            width={102}
            height={51}
          ></Image>
          <Image
            src="/assets/icon-location.png"
            alt="NewEgg Icon"
            width={28}
            height={28}
          ></Image>
          <input type="text" className={styles.search}></input>
        </div>
        <div className={styles.right}>
          <Image
            src="/assets/icon-bell.png"
            alt="Bell Icon"
            width={28}
            height={28}
          ></Image>
          <a href="">
            <Image
              src="/assets/en.svg"
              alt="flag"
              height={16}
              width={16}
            ></Image>
          </a>
          <div>
            <a href="/login" className={styles.user}>
              <Image
                src="/assets/icon-user.png"
                alt="User Icon"
                height={28}
                width={28}
              ></Image>
              <div className={styles.text}>
                <div>Welcome</div>
                {!auth ? <div>Sign In / Register</div> : <div>{user}</div>}
              </div>
            </a>
          </div>
          <div>
            <a href="" className={styles.returns}>
              <div className={styles.orders}>
                <div>Returns</div>
                <div>& Orders</div>
              </div>
            </a>
          </div>
          <Image
            src="/assets/icon-cart.png"
            alt="Cart Icon"
            height={28}
            width={28}
          ></Image>
        </div>
      </div>
      <div className={styles.bottom}></div>
    </div>
  );
}