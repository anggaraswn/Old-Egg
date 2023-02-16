import Head from 'next/head';
import Image from 'next/image';
import { Inter } from '@next/font/google';
import styles from '@/styles/Home.module.css';

// Note: The subsets need to use single quotes because the font loader values must be explicitly written literal.
// eslint-disable-next-line @typescript-eslint/quotes
const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  return (
    <>
      <a href="/login">Test</a>
    </>
  );
}
