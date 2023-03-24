import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import styles from './Index.module.css';

export default function PublicWishlistDetail() {
  return (
    <div>
      <Navbar />
      <div className={styles.content}></div>
      <FooterMain />
    </div>
  );
}
