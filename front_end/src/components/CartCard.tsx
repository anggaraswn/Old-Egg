import styles from './CartCard.module.css';

interface Product {
  id: string;
  name: string;
  images: string;
  price: number;
  rating: number;
  numberOfReviews: number;
  numberBought: number;
  stock: number;
  description: string;
  discount: number;
}

interface Cart {
  product: Product;
  quantity: number;
  notes: string;
}

export default function CartCard(props: { cart: Cart }) {
  const { cart } = props;

  return (
    <div className={styles.cardItem}>
      <div className={styles.itemContainer}>
        <img src={cart.product.images} className={styles.productImage}></img>
        <div className={styles.itemInfo}>{cart.product.name}</div>
        <div className={styles.itemQuantity}>{cart.quantity}</div>
        <div className={styles.itemAction}>${cart.product.price}</div>
      </div>
      <div className={styles.itemSubContainer}>
        <div className={styles.flex}>
          <button>
            <img src="/assets/icon-heart.png" alt="" height={12} /> MOVE TO WISH
            LIST
          </button>
          <button>
            <img src="/assets/icon-save.png" alt="" height={12} /> SAVE FOR
            LATER
          </button>
        </div>
        <div className={styles.flex}>
          <button>
            <img src="/assets/icon-delete.png" alt="" height={12} /> REMOVE
          </button>
        </div>
      </div>
      {/* <div className={styles.divider}></div> */}
    </div>
  );
}
