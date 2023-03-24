import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from './Index.module.css';

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
  rating: number;
}

export default function UpdateAbout() {
  const router = useRouter();
  const { id } = router.query;
  const token = getCookie('jwt');
  const [shop, setShop] = useState<Shop | null>(null);
  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const GET_SHOP_QUERY = `query shop($id: ID){
    shop(id: $id){
      id,
      name,
      image,
      banner,
      followers,
      salesCount,
      policy,
      aboutUs,
      banned,
      rating,
      products{
        id,
        name,
        images,
        price
        category{
          id,
          name
        },
      }
    }
  }`;

  const UPDATE_SHOP_MUTATION = `mutation updateShop($aboutUs: String, $shopName: String, $image: String){
    updateShop(aboutUs: $aboutUs, shopName: $shopName, image: $image){
      id,
      name,
      aboutUs,
      image
    }
  }`;

  useEffect(() => {
    if (id) {
      GRAPHQLAPI.post('', {
        query: GET_SHOP_QUERY,
        variables: {
          id: id,
        },
      }).then((response) => {
        console.log(response);
        setShop(response.data.data.shop);
      });
    }
  }, [id]);

  const handleUpdate = () => {
    GRAPHQLAPI.post(
      '',
      {
        query: UPDATE_SHOP_MUTATION,
        variables: {
          aboutUs: (document.getElementById('aboutUs') as HTMLInputElement)
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
      window.location.href = '/shopOwner/';
    });
  };
  return (
    <div className={styles.container2}>
      <h1>Update About Us</h1>
      <textarea
        name="aboutUs"
        id="aboutUs"
        rows={10}
        cols={100}
        maxLength={1000}
        defaultValue={shop?.aboutUs}
      ></textarea>
      <button className={styles.orangeBTN} onClick={handleUpdate}>
        Update Now
      </button>
    </div>
  );
}
