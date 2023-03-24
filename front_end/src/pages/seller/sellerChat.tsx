import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import styles from './SellerChat.module.css';

export default function SellerChar() {
  return (
    <div>
      <Navbar />
      <div className={styles.content}></div>
      <FooterMain />
    </div>
  );
}
