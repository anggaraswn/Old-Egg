import FooterMain from '@/components/footerMain';
import Navbar from '@/components/navbar';
import styles from '../styles/Reviews.module.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  subscribe: boolean;
  banned: boolean;
}

interface Product {
  id: string;
  name: string;
  images: string;
  price: number;
  rating: number;
  numberOfReviews: number;
  numberBought: number;
  stock: number;
  description: string;
  discount: number;
}

interface Review {
  id: string;
  user: User;
  product: Product;
  createdAt: string;
  rating: number;
  description: string;
}

export default function Reviews() {
  const token = getCookie('jwt');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [changes, setChanges] = useState(0);
  const [defaultDisplay, setDefaultDisplay] = useState(true);
  const [selected, setSelected] = useState<Review>(reviews[0]);
  const [fullStar, setFullStar] = useState(0);
  const [halfStar, setHalfStar] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const GET_REVIEWS_QUERY = `query{
    reviews{
      id,
      user{
        id,
        firstName,
        lastName
      },
      product{
         id,
         name,
         images,
         price,
         discount,
         stock,
         description
      },
      createdAt,
      rating,
      description
    }
  }`;

  const DELETE_REVIEW_MUTATION = `mutation deleteReview($reviewID: ID!){
    deleteReview(reviewID: $reviewID){
      id,
      user{
        id,
        firstName,
        lastName
      },
      product{
         id,
         name,
         images,
         price,
         discount,
         stock,
         description
      },
      createdAt,
      rating,
      description
    }
  }`;

  const UPDATE_REVIEW_MUTATION = `mutation updateReview($reviewID: ID!, $rating: Float!, $description: String!){
    updateReview(reviewID: $reviewID, rating: $rating, description: $description){
      id,
      user{
        id,
        firstName,
        lastName
      },
      product{
         id,
         name,
         images,
         price,
         discount,
         stock,
         description
      },
      createdAt,
      rating,
      description
    }
  }`;

  useEffect(() => {
    GRAPHQLAPI.post(
      '',
      {
        query: GET_REVIEWS_QUERY,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      setReviews(response.data.data.reviews);
    });
  }, [changes]);

  useEffect(() => {
    setFullStar(Math.floor(selected?.rating));
    setHalfStar(Math.round(selected?.rating - fullStar));
  }, [selected]);

  const handleDelete = (review: Review) => {
    GRAPHQLAPI.post(
      '',
      {
        query: DELETE_REVIEW_MUTATION,
        variables: {
          reviewID: review.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      setChanges(changes + 1);
    });
  };

  const handleDetail = (review: Review) => {
    setSelected(review);
    setDefaultDisplay(false);
  };

  const handleBack = () => [setDefaultDisplay(true)];

  const handleUpdate = (review: Review) => {
    setSelected(review);
    setDefaultDisplay(false);
    setIsUpdate(true);
  };

  const handleUpdateReview = () => {
    GRAPHQLAPI.post(
      '',
      {
        query: UPDATE_REVIEW_MUTATION,
        variables: {
          reviewID: selected.id,
          rating: (document.getElementById('rating') as HTMLInputElement).value,
          description: (
            document.getElementById('description') as HTMLInputElement
          ).value,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      setChanges(changes + 1);
      setIsUpdate(false);
      setDefaultDisplay(true);
    });
  };

  return (
    <div>
      <Navbar />
      {defaultDisplay == true && isUpdate == false && (
        <div className={styles.content}>
          <h1>Reviews</h1>
          <div className={styles.reviewsContainer}>
            {reviews.map((r) => {
              const fullStars = Math.floor(r.rating);
              const halfStars = Math.round(r.rating - fullStars);
              return (
                <div className={styles.reviewCard}>
                  <div className={styles.links}>
                    <a href="#" onClick={() => handleDelete(r)}>
                      Delete
                    </a>
                    <a href="#" onClick={() => handleUpdate(r)}>
                      Update
                    </a>
                  </div>
                  <div
                    className={styles.clickable}
                    onClick={() => handleDetail(r)}
                  >
                    <div className={styles.group}>
                      <div>
                        Ratings:
                        {[...Array(fullStars >= 0 ? fullStars : 0)].map(
                          (_, index) => (
                            <FaStar key={index} className={styles.star} />
                          ),
                        )}
                        {[...Array(halfStars >= 0 ? halfStars : 0)].map(
                          (_, index) => (
                            <FaStarHalfAlt
                              key={index}
                              className={styles.star}
                            />
                          ),
                        )}
                      </div>
                      <div>{new Date(r.createdAt).toDateString()}</div>
                    </div>
                    <div className={styles.description}>{r.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {defaultDisplay == false && isUpdate == false && (
        <div className={styles.detail}>
          <h1>Review Details</h1>
          <div className={styles.reviewsContainer}>
            <div className={styles.reviewCard}>
              <div className={styles.links}>
                <a href="#" onClick={() => handleDelete(selected)}>
                  Delete
                </a>
                <a href="#" onClick={() => handleUpdate(selected)}>
                  Update
                </a>
                <a href="#" onClick={handleBack}>
                  Back
                </a>
              </div>
              <div className={styles.group}>
                <div>
                  Ratings:
                  {[...Array(fullStar >= 0 ? fullStar : 0)].map((_, index) => (
                    <FaStar key={index} className={styles.star} />
                  ))}
                  {[...Array(halfStar >= 0 ? halfStar : 0)].map((_, index) => (
                    <FaStarHalfAlt key={index} className={styles.star} />
                  ))}
                </div>
                <div>{new Date(selected.createdAt).toDateString()}</div>
              </div>
              <div className={styles.product}>
                <img src={selected?.product.images} alt="Product Image" />
                <div className={styles.productInfo}>
                  <div>{selected?.product.name}</div>
                  <div>${selected?.product.price}</div>
                </div>
              </div>
              <div className={styles.description}>{selected.description}</div>
            </div>
          </div>
        </div>
      )}
      {defaultDisplay == false && isUpdate == true && (
        <div className={styles.updateContainer}>
          <h1>Update Review</h1>
          <div className={styles.form}>
            <div className={styles.inputField}>
              <label htmlFor="rating">Review Rating</label>
              <input type="number" id="rating" defaultValue={selected.rating} />
            </div>
            <div className={styles.inputField}>
              <label htmlFor="description">Review Description</label>
              <input
                type="text"
                id="description"
                defaultValue={selected.description}
              />
            </div>
            <div className={styles.buttonContainer}>
              <button
                className={styles.backBTN}
                onClick={() => {
                  setIsUpdate(false);
                  setDefaultDisplay(true);
                }}
              >
                Back
              </button>
              <button className={styles.orangeBTN} onClick={handleUpdateReview}>
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      <FooterMain />
    </div>
  );
}
