import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import styles from '../styles/CustomerService.module.css';

export default function CustomerService() {
  return (
    <div>
      <Navbar />
      <div className={styles.content}></div>
      <FooterMain />
    </div>
  );
}
