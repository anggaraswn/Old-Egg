import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import styles from '../styles/BuildPC.module.css';

export default function BuildPC() {
  return (
    <div>
      <Navbar />
      <div className={styles.content}></div>
      <FooterMain />
    </div>
  );
}
