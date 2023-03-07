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

// Note: The subsets need to use single quotes because the font loader values must be explicitly written literal.
// eslint-disable-next-line @typescript-eslint/quotes
const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const [images, setImages] = useState<ImageType[]>();

  useEffect(() => {
    setImages([
      { id: 1, url: '/assets/carousel/1.png' },
      { id: 2, url: '/assets/carousel/2.png' },
      { id: 3, url: '/assets/carousel/3.png' },
      { id: 4, url: '/assets/carousel/4.png' },
      { id: 5, url: '/assets/carousel/5.png' },
    ]);

    document.body.style.margin = '0';
    document.body.style.width = '100%';
  }, []);

  return (
    <>
      <Navbar />
      <Carousel images={images}></Carousel>
      <a href="/login">Test</a>
      <ProductRecommendations />
      <FooterMain />
    </>
  );
}
