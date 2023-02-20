import styles from '../components/Card.module.css';

interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
}

const productDetail = (productID: string) => {
  return '/product/' + productID;
};

export default function Card({ id, image, name, price }: Product) {
  return (
    <div className={styles.cardContainer}>
      <a href={productDetail(id)}>
        <img src={image} className={styles.productImage}></img>
        <p className={styles.productName}>{name}</p>
        <p className={styles.productPrice}>${price}</p>
      </a>
    </div>
  );
}
