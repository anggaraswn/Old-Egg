import styles from '../components/ShopCard.module.css';

interface Shop {
  id: string;
  name: string;
  image: string;
  banner: string;
  followers: number;
  salesCount: number;
  policy: string;
  aboutUs: string;
  banned: boolean;
}

const shopDetail = (shopID: string) => {
  return '/shop/' + shopID;
};

export default function ShopCard({
  id,
  name,
  image,
  banner,
  followers,
  salesCount,
  policy,
  aboutUs,
  banned,
}: Shop) {
  return (
    <div className={styles.cardContainer}>
      <a href={shopDetail(id)}>
        <img src={image} className={styles.shopImage}></img>
        <p className={styles.shopName}>{name}</p>
        {/* <p className={styles.shopPrice}>${price}</p> */}
      </a>
    </div>
  );
}
