import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import styles from '../styles/CustomerChat.module.css';

export default function CustomerChat() {
  return (
    <div>
      <Navbar />
      <div className={styles.content}></div>
      <FooterMain />
    </div>
  );
}
