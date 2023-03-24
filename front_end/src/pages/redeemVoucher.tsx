import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import styles from '../styles/RedeemVoucher.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getCookie } from 'cookies-next';

export default function RedeemVoucher() {
  const [currency, setCurrency] = useState('');
  const token = getCookie('jwt');
  const [error, setError] = useState('');

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const REDEEM_MUTATION = `mutation redeemVoucher($voucherID: ID!){
    reedemVoucher(voucherID: $voucherID){
      id,
      currency,
      valid
    }
  }`;

  useEffect(() => {
    setCurrency('');
  }, [error]);

  const handleRedeem = () => {
    GRAPHQLAPI.post(
      '',
      {
        query: REDEEM_MUTATION,
        variables: {
          voucherID: (document.getElementById('voucher') as HTMLInputElement)
            .value,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      if (response.data.data.reedemVoucher == null) {
        setError('Invalid Voucher Code');
      } else {
        setCurrency(
          `Adding $${response.data.data.reedemVoucher.currency} to your current currency!`,
        );
      }
    });
  };
  return (
    <div>
      <Navbar />
      <div className={styles.content}>
        <h1>Redeem Voucher</h1>
        <div className={styles.form}>
          <div className={styles.group}>
            <label htmlFor="voucher">Voucher Code</label>
            <input type="text" id="voucher" placeholder="Input voucher code" />
          </div>
        </div>
        <button className={styles.orangeBTN} onClick={handleRedeem}>
          Redeem
        </button>
        <p>{currency}</p>
        <p className={styles.error}>{error}</p>
      </div>
      <FooterMain />
    </div>
  );
}
