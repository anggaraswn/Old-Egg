import Navbar from '@/components/navbar';
import styles from './PublicWishlist.module.css';
import { getCookie } from 'cookies-next';
import { useState } from 'react';
import axios from 'axios';

export default function PublicWishlist() {
  const token = getCookie('jwt');
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });

  const handleClick = (option: any) => {
    setSelected(option);
  };

  const openModal = () => {
    setIsOpen(true);
    console.log(isOpen);
  };

  const closeModal = () => {
    setIsOpen(false);
    console.log(isOpen);
  };

  return (
    <div>
      <Navbar />
      <div
        className={`${styles['body']} ${isOpen ? styles['open'] : styles['']}`}
      >
        <Navbar />
        <div className={styles.background} onClick={closeModal}></div>
        {/* <div
          className={`${styles.modal} ${isOpen ? styles['open'] : styles['']}`}
        >
          <p className={styles.modalTitle}>Create a List</p>
          <div className={styles.form}>
            <label htmlFor="inputName">Name</label>
            <input type="text" id="inputName" />
          </div>
          <p className={styles.privacyTxt}>Privacy</p>
          <div className={styles.privacyContainer}>
            <div
              className={`${styles.publicP} ${
                selected === 'PUBLIC' ? styles.selected : ''
              }`}
              onClick={() => handleClick('PUBLIC')}
            >
              Public
            </div>
            <div
              className={`${styles.privateP} ${
                selected === 'PRIVATE' ? styles.selected : ''
              }`}
              onClick={() => handleClick('PRIVATE')}
            >
              Private
            </div>
          </div>
          <div className={styles.addLine}>
            <div className={styles.errorMsg}>{error}</div>
            <div className={styles.createBTNContainer}>
              <button onClick={createWishlist}>CREATE</button>
            </div>
          </div>
        </div> */}
        <div className={styles.container}>
          <p>Home &gt; Wish List</p>
          <div className={styles.topBar}>
            <div className={styles.pageTitle}>WISH LIST</div>
            <button className={styles.selectedBTN}>My Lists</button>
            <button className={styles.otherBTN}>Followed Lists</button>
            <button className={styles.otherBTN}>Public Lists</button>
          </div>
          <div className={styles.pageSectionInner}>
            <div className={styles.wishlistOperate}>
              {/* <button className={styles.createListBTN} onClick={createList}>
                CREATE A LIST
              </button> */}
              <button className={styles.manageListBTN}>MANAGE LISTS</button>
              <div className={styles.cardInfo}>
                {/* <div className={styles.cardTitle}>My Favorites</div> */}
                {/* {wishlists?.map((w) => {
                  return <WishlistCard wishlist={w} />;
                })} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
