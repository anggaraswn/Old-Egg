import Link from 'next/link';
import styles from '../components/Card.module.css';

interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
}

export default function Card(props: Product) {
  return (
    <div className={styles.cardContainer}>
      <a href="">
        <img src={props.image} className={styles.productImage}></img>
        <p className={styles.productName}>{props.name}</p>
        <p className={styles.productPrice}>${props.price}</p>
      </a>
    </div>
  );
}
