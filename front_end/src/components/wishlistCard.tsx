import styles from './WishlistCard.module.css';

interface Product {
  id: string;
  image: string;
  name: string;
  price: number;
}

export default function WishlistCard(title: string, product: Product[]) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitle}>
        <span>{title}</span>
      </div>
      <div className={styles.top}>
        <ul className={styles.wishlistItem}>
          {product.map((p) => {
            return (
              <li>
                <div className={styles.itemContainer}>
                  <img src={p.image} alt="image logo" />
                  <p>{p.name}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
