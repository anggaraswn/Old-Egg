import Navbar from '@/components/navbar';
import styles from './Index.module.css';
import { useState } from 'react';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import WishlistCard from '@/components/wishlistCard';

export default function WishList() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const token = getCookie('jwt');

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });

  const CREATE_WISHLIST = `mutation createWishlist($name: String!, $option: Option!){
    createWishlist(name: $name, option:$option){
      id,
      name,
      option
    }
  }`;

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

  const createList = () => {
    openModal();
  };

  const createWishlist = () => {
    console.log(selected);
    console.log(
      (document.getElementById('inputName') as HTMLInputElement).value,
    );
    if (selected) {
      GRAPHQLAPI.post(
        '',
        {
          query: CREATE_WISHLIST,
          variables: {
            name: (document.getElementById('inputName') as HTMLInputElement)
              .value,
            option: selected,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ).then((response) => {
        console.log(response);
      });
      setError('');
    } else {
      setError('Please choose whether public or privacy');
    }
  };

  return (
    <div
      className={`${styles['body']} ${isOpen ? styles['open'] : styles['']}`}
    >
      <Navbar />
      <div className={styles.background} onClick={closeModal}></div>
      <div
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
      </div>
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
            <button className={styles.createListBTN} onClick={createList}>
              CREATE A LIST
            </button>
            <button className={styles.manageListBTN}>MANAGE LISTS</button>
            <div className={styles.cardInfo}>
              {/* <div className={styles.cardTitle}>My Favorites</div> */}
              <WishlistCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
