import { useEffect, useState } from 'react';
import styles from './InsertProduct.module.css';
import { getCookie } from 'cookies-next';
import axios from 'axios';

interface Category {
  id: string;
  name: string;
  description: string;
}

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

interface Brand {
  id: string;
  name: string;
  image: string;
  description: string;
}

export default function InsertProduct() {
  const token = getCookie('jwt');
  const [shop, setShop] = useState<Shop | null>(null);
  const [user, setUser] = useState([]);
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [listCategory, setListCategory] = useState<Category[]>([]);
  const [listBrand, setListBrand] = useState<Brand[]>([]);
  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const GET_BRANDS_QUERY = `query{
    brands{
      id,
      name,
      image,
      description
    }
  }`;

  const GET_CATEGORIES_QUERY = `query{
    categories{
      id,
      name,
      description
    }
  }`;

  const INSERT_PRODUCTS_MUTATION = `mutation createProduct($name: String!, $categoryID: ID!, $shopID: ID!, $images: String!, $description: String!, $price: Float!, $stock: Int!, $brandID: ID!){
    createProduct(input:{
      name: $name,
      categoryID: $categoryID,
      shopID: $shopID,
      images: $images,
      description: $description,
      price: $price,
      discount: 0,
      stock: $stock,
      brandID: $brandID
    }){
      id,
      name,
      price
    }
  }`;

  const GET_CURRENT_USER = `query{
    getCurrentUser{
      id,
      firstName,
      lastName,
      email,
      phone,
      password,
      subscribe,
      banned,
      role
    }
  }
  `;

  const GET_SHOP_QUERY = `query shop($userID: ID){
    shop(userID: $userID){
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

  useEffect(() => {
    GRAPHQLAPI.post(
      '',
      {
        query: GET_CURRENT_USER,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      setUser(response.data.data.getCurrentUser);
      GRAPHQLAPI.post('', {
        query: GET_SHOP_QUERY,
        variables: {
          userID: response.data.data.getCurrentUser.id,
        },
      })
        .then((res) => {
          console.log(res);
          setShop(res.data.data.shop);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    GRAPHQLAPI.post('', {
      query: GET_BRANDS_QUERY,
    }).then((response) => {
      console.log(response);
      setListBrand(response.data.data.brands);
    });

    GRAPHQLAPI.post('', {
      query: GET_CATEGORIES_QUERY,
    }).then((response) => {
      console.log(response);
      setListCategory(response.data.data.categories);
    });
  }, []);

  const handleInsert = () => {
    console.log(category?.id);
    GRAPHQLAPI.post('', {
      query: INSERT_PRODUCTS_MUTATION,
      variables: {
        name: (document.getElementById('name') as HTMLInputElement).value,
        categoryID: category,
        shopID: shop?.id,
        images: (document.getElementById('images') as HTMLInputElement).value,
        description: (
          document.getElementById('description') as HTMLInputElement
        ).value,
        price: (document.getElementById('price') as HTMLInputElement).value,
        discount: 0,
        stock: (document.getElementById('stock') as HTMLInputElement).value,
        brandID: brand,
      },
    })
      .then((response) => {
        console.log(response);

        window.location.href = '/shopOwner/';
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    console.log(category);
  }, [category]);

  return (
    <div className={styles.container}>
      <h1>Insert Product</h1>
      <div className={styles.form}>
        <div className={styles.group}>
          <label htmlFor="name">Product's Name</label>
          <input type="text" id="name" />
        </div>
        <div className={styles.group}>
          <label htmlFor="category">Product's Category</label>
          <div className={styles.selectContainer}>
            <select
              value={category}
              className={styles.select}
              onChange={(event) => {
                setCategory(event.target.value);
              }}
            >
              {listCategory.map((x) => {
                return <option value={x.id}>{x.name}</option>;
              })}
            </select>
          </div>
        </div>
        <div className={styles.group}>
          <label htmlFor="brand">Product's Brand</label>
          <div className={styles.selectContainer}>
            <select
              value={brand}
              className={styles.select}
              onChange={(event) => {
                setBrand(event.target.value);
              }}
            >
              {listBrand.map((x) => {
                return <option value={x.id}>{x.name}</option>;
              })}
            </select>
          </div>
        </div>

        <div className={styles.group}>
          <label htmlFor="images">Product's Images</label>
          <input type="text" id="images" />
        </div>
        <div className={styles.group}>
          <label htmlFor="description">Product's Description</label>
          <input type="text" id="description" />
        </div>
        <div className={styles.group}>
          <label htmlFor="price">Product's Price</label>
          <input type="text" id="price" />
        </div>
        <div className={styles.group}>
          <label htmlFor="stock">Product's Stock</label>
          <input type="text" id="stock" />
        </div>
        <div className={styles.group}>
          <label htmlFor="details">Product's Details</label>
          <input type="text" id="details" />
        </div>
      </div>
      <button className={styles.orangeBTN} onClick={handleInsert}>
        Insert
      </button>
    </div>
  );
}
