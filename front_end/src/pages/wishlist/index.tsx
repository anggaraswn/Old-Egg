import Navbar from '@/components/navbar';
import styles from './Index.module.css';
import { useState } from 'react';

export default function WishList() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('');

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
              selected === 'public' ? styles.selected : ''
            }`}
            onClick={() => handleClick('public')}
          >
            Public
          </div>
          <div
            className={`${styles.privateP} ${
              selected === 'private' ? styles.selected : ''
            }`}
            onClick={() => handleClick('private')}
          >
            Private
          </div>
        </div>
        <div className={styles.saveBTNContainer}>
          {/* <button onClick={saveWishlist}>Save</button> */}
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
              <div className={styles.cardTitle}>My Favorites</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
