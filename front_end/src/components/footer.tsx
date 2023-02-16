import styles from './footer.module.css';

export default function Footer() {
  return (
    <div className={styles.footer}>
      <div className={styles.link}>
        <a href="#" className={styles.gray}>
          Terms & Conditions
        </a>
        &nbsp;|&nbsp;
        <a href="#" className={styles.gray}>
          Privacy Policy.
        </a>
      </div>
      <div className={styles.test}>
        <p>© 2000-2023 Newegg Inc. All rights reserved.</p>
      </div>
    </div>
  );
}
