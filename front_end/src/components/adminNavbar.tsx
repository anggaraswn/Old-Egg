import styles from './AdminNavrbar.module.css';
import Image from 'next/image';
import axios from 'axios';
import { getCookie, removeCookies } from 'cookies-next';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import DropdownItem from './dropDownItem';

export default function AdminNavigationBar() {
  const token = getCookie('jwt');
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState('');
  const [open, setOpen] = useState(false);

  const logOut = () => {
    removeCookies('jwt');
    const router = useRouter();
    router.reload();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <div className={styles.hamburger}>
          <Image
            src="/assets/icon-hamburger.png"
            alt="Hamburger Icon"
            width={28}
            height={28}
          ></Image>
        </div>
        <div className={styles.logo}>
          <a href="/">
            <Image
              src="/assets/logo.png"
              alt="NewEgg Icon"
              width={102}
              height={51}
            ></Image>
          </a>
        </div>
        <div>
          <Image
            src="/assets/icon-location.png"
            alt="NewEgg Icon"
            width={28}
            height={28}
          ></Image>
        </div>
      </div>
      <div className={styles.center}>
        <div className={styles.search}>
          <input type="text" />
          <button className={styles.searchIcon}>
            <Image
              src="/assets/icon-search.png"
              alt="Search Icon"
              width={20}
              height={20}
            ></Image>
          </button>
        </div>
      </div>
      <div className={styles.right}>
        <Image
          src="/assets/icon-bell.png"
          alt="Bell Icon"
          width={28}
          height={28}
        ></Image>
        <a href="">
          <Image src="/assets/en.svg" alt="flag" height={16} width={16}></Image>
        </a>
        <div>
          <a
            className={styles.user}
            // href=""
            onClick={() => setOpen((prev) => !prev)}
          >
            <Image
              src="/assets/icon-user.png"
              alt="User Icon"
              height={28}
              width={28}
            ></Image>
            <div className={styles.text}>
              <div>Welcome</div>
              <div>{user}</div>
              {open && (
                <div
                  className={`${styles['dropdownMenu']} ${
                    styles[open ? 'active' : 'inactive']
                  }`}
                >
                  <p className={styles.dropdownText}>{user}</p>
                  <p className={styles.dropdownText}>
                    Thank you for being Newegg admin
                  </p>
                  <ul className={styles.listItem}>
                    <DropdownItem
                      image="/assets/icon-settings.png"
                      text="Account Settings"
                      link="/settings"
                    />
                    <DropdownItem
                      image="/assets/icon-wishlist.png"
                      text="Wishlist"
                      link="/wishlist"
                    />
                    <DropdownItem
                      image="/assets/icon-logout.png"
                      text="Log Out"
                      click={logOut}
                    />
                  </ul>
                </div>
              )}
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
        {/* <Image
          onClick={openCart}
          src="/assets/icon-cart.png"
          alt="Cart Icon"
          height={28}
          width={28}
          className={styles.cart}
        ></Image> */}
      </div>
    </nav>
  );
}
