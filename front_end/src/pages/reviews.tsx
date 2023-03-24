import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import styles from '../styles/Reviews.module.css';

export default function Reviews() {
  return (
    <div>
      <Navbar />
      <div className={styles.content}></div>
      <FooterMain />
    </div>
  );
}
