import Card from '@/components/card';
import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import ProductCard from '@/components/productCard';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './Index.module.css';

interface Product {
  id: string;
  name: string;
  images: string;
  price: number;
  discount: number;
  rating: number;
  stock: number;
  description: string;
  numberOfReviews: number;
  numberBought: number;
  numberOfRatings: number;
}

export default function ShopProductsCategory() {
  const router = useRouter();
  const { id, categoryID, categoryName } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('highestPrice');

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const SHOP_PRODUCTS_QUERY = `query shopProducts($shopID: ID!, $categoryID: ID, $sortBy: String){
    shopProducts(shopID: $shopID, categoryID: $categoryID, sortBy: $sortBy){
      id,
      name,
      images,
      price,
      discount,
      rating,
      stock
    }
  }`;
  const productDetail = (productID: string) => {
    return '/product/' + productID;
  };

  useEffect(() => {
    GRAPHQLAPI.post('', {
      query: SHOP_PRODUCTS_QUERY,
      variables: {
        shopID: id,
        categoryID: categoryID,
      },
    })
      .then((response) => {
        console.log(response);
        setProducts(response.data.data.shopProducts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, categoryID]);

  useEffect(() => {
    console.log(sortBy);
    GRAPHQLAPI.post('', {
      query: SHOP_PRODUCTS_QUERY,
      variables: {
        shopID: id,
        categoryID: categoryID,
        sortBy: sortBy,
      },
    })
      .then((response) => {
        console.log(response);
        setProducts(response.data.data.shopProducts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [sortBy]);
  return (
    <div>
      <Navbar />
      <h1 className={styles.title}>Products With Category: {categoryName}</h1>
      <div className={styles.sortByContainer}>
        <span>Sort By: </span>
        <select
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value);
          }}
          className={styles.selectstyle}
        >
          <option value="lowestPrice">Lowest Price</option>
          <option value="highestPrice">Highest Price</option>
          <option value="topBuyed">Top Buyed</option>
          <option value="topRating">Top Rating</option>
        </select>
      </div>
      <div className={styles.itemsContainer}>
        {products.map((p) => {
          console.log(p);
          return (
            <div className={styles.cardContainer}>
              <a href={productDetail(p.id)} className={styles.flex}>
                <img src={p.images} className={styles.productImage}></img>
                <p className={styles.productName}>{p.name}</p>
                <p className={styles.productPrice}>${p.price}</p>
              </a>
            </div>
          );
        })}
      </div>
      <FooterMain />
    </div>
  );
}
