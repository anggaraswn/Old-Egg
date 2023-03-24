import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import styles from '../styles/MessageCenter.module.css';

export default function MessageCenter() {
  return (
    <div>
      <Navbar />
      <div className={styles.content}></div>
      <FooterMain />
    </div>
  );
}
