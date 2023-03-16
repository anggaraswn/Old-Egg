import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '../styles/Home.module.css';
import Navbar from '@/components/navbar';
import Carousel, { ImageType } from '@/components/carousel';
import { useEffect, useState } from 'react';
import PromoCarousel from '@/components/carousel';
import ProductRecommendations from '@/components/productRecommendations';
import FooterMain from '@/components/footerMain';
import axios from 'axios';
import ShopCard from '@/components/shopCard';

// Note: The subsets need to use single quotes because the font loader values must be explicitly written literal.
// eslint-disable-next-line @typescript-eslint/quotes
const inter = Inter({ subsets: ['latin'] });

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

export default function Home() {
  const [images, setImages] = useState<ImageType[]>();
  const [shops, setShops] = useState<Shop[] | null>([]);
  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const GET_SHOPS_QUERY = `query{
    shops{
      id,
      name,
      image,
      banner,
      followers,
      salesCount,
      policy,
      aboutUs,
      banned,
      user{
        id,
        firstName,
        lastName
      }
    }
  }`;

  useEffect(() => {
    setImages([
      { id: 1, url: '/assets/carousel/1.png' },
      { id: 2, url: '/assets/carousel/2.png' },
      { id: 3, url: '/assets/carousel/3.png' },
      { id: 4, url: '/assets/carousel/4.png' },
      { id: 5, url: '/assets/carousel/5.png' },
    ]);

    document.body.style.margin = '0';
    document.body.style.width = '100';

    GRAPHQLAPI.post('', {
      query: GET_SHOPS_QUERY,
    })
      .then((response) => {
        console.log(response);
        console.log('fetch shop');
        setShops(response.data.data.shops);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Navbar />
      <Carousel images={images}></Carousel>
      <a href="/login">Test</a>
      <ProductRecommendations />
      <div className={styles.topShops}>
        <div className={styles.sectionTitle}>
          <h2>Expolore Our Top 3 Shops</h2>
        </div>
        <div className={styles.shops}>
          {shops?.map((s) => {
            return (
              <ShopCard
                id={s.id}
                name={s.name}
                image={s.image}
                banner={s.banner}
                followers={s.followers}
                salesCount={s.salesCount}
                policy={s.policy}
                aboutUs={s.aboutUs}
                banned={s.banned}
                key={s.id}
              />
            );
          })}
        </div>
      </div>
      <FooterMain />
    </>
  );
}
