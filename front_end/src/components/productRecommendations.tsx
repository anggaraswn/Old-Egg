import { useEffect, useState } from 'react';
import styles from '../components/ProductRecommendations.module.css';
import Card from './card';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  images: string;
  price: number;
  rating: number;
  numberOfReviews: number;
  numberBought: number;
}

export default function ProductRecommendations() {
  const [products, setProducts] = useState<Product[]>([]);
  // const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      setLoading(true);
      const GRAPHQLAPI = axios.create({
        baseURL: 'http://localhost:8080/query',
      });
      const GET_PRODUCTS = `query{
      products{
        id,
        name,
        images,
        price,
        rating,
        numberOfReviews,
        numberBought
      }
    }`;

      GRAPHQLAPI.post('', {
        query: GET_PRODUCTS,
      })
        .then((response) => {
          console.log(response);
          setProducts(response.data.data.products);
          // console.log(response.data.data.products);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);
  console.log(products);
  return (
    <div>
      <div>Product Recommendations</div>
      <div className={styles.cardContainer}>
        {products.map((p) => {
          return (
            <Card id={p.id} image={p.images} name={p.name} price={p.price} />
          );
        })}
      </div>
    </div>
  );
}
