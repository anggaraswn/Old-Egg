import styles from './Index.module.css';

export default function AdminMainPage() {
  return (
    <div>
      <div className={styles.title}>Admin Page</div>
      <div className={styles.addNewVoucher}></div>
      <div className={styles.insertShop}>
        <div className={styles.title}>Insert Shop</div>
        <button onClick={() => (window.location.href = '/admin/insertShop')}>
          Insert New Shop
        </button>
      </div>
    </div>
  );
}
