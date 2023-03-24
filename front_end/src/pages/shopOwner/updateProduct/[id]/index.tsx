import styles from './Index.module.css';
import { getCookie } from 'cookies-next';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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

interface Brand {
  id: string;
  name: string;
  image: string;
  description: string;
}

export default function UpdateProduct() {
  const token = getCookie('jwt');
  const router = useRouter();
  const { id } = router.query;
  const [shop, setShop] = useState<Shop | null>(null);
  const [user, setUser] = useState([]);
  const [product, setProduct] = useState<Product | null>(null);
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

  const GET_PRODUCT_QUERY = `query product($id: ID!){
    product(id: $id){
      id,
      name,
      images,
      price,
      stock,
      description,
      category{
        id,
        name,
        description
      },
      brand{
        id,
        name,
        image
      }
    }
  }`;

  const UPDATE_PRODUCT_MUTATION = `mutation updateProduct($productID: ID!, $name: String!, $categoryID: ID!, $shopID: ID!, $brandID: ID!, $images: String!, $description: String!, $price: Float!, $stock: Int!){
    updateProduct(productID: $productID, input: {
      name: $name,
      categoryID: $categoryID,
      shopID: $shopID,
      brandID: $brandID,
      images: $images,
      description: $description,
      price: $price,
      stock: $stock,
      discount: 0
    }){
      id,
      name,
      images,
      price
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

    if (id) {
      GRAPHQLAPI.post('', {
        query: GET_PRODUCT_QUERY,
        variables: {
          id: id,
        },
      }).then((response) => {
        console.log(response);
        setProduct(response.data.data.product);
      });
    }
  }, [id]);

  const handleUpdate = () => {
    GRAPHQLAPI.post(
      '',
      {
        query: UPDATE_PRODUCT_MUTATION,
        variables: {
          productID: id,
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
    <div className={styles.container}>
      <h1>Update Product</h1>
      <div className={styles.form}>
        <div className={styles.group}>
          <label htmlFor="name">Product's Name</label>
          <input type="text" id="name" defaultValue={product?.name} />
        </div>
        <div className={styles.group}>
          <label htmlFor="category">Product's Category</label>
          <div className={styles.selectContainer}>
            <select
              value={category}
              defaultValue={product?.category.name}
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
              defaultValue={product?.brand.name}
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
          <input type="text" id="images" defaultValue={product?.images} />
        </div>
        <div className={styles.group}>
          <label htmlFor="description">Product's Description</label>
          <input
            type="text"
            id="description"
            defaultValue={product?.description}
          />
        </div>
        <div className={styles.group}>
          <label htmlFor="price">Product's Price</label>
          <input type="text" id="price" defaultValue={product?.price} />
        </div>
        <div className={styles.group}>
          <label htmlFor="stock">Product's Stock</label>
          <input type="text" id="stock" defaultValue={product?.stock} />
        </div>
        <div className={styles.group}>
          <label htmlFor="details">Product's Details</label>
          <input type="text" id="details" />
        </div>
      </div>
      <button className={styles.orangeBTN} onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
}
