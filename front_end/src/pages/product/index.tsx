import axios from 'axios';
import { useRouter } from 'next/router';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;

  const GRAPHQLAPI = axios.create({
    baseURL: 'http://localhost:8080/query',
  });

  const GET_PRODUCT = `query product($id: ID!){
    product(id: $id){
    id,
    name,
    images,
    price,
    discount,
    rating,
    stock,
    description,
    numberOfReviews,
    numberBought
  }
  }
  `;

  return (
    <div>
      <div>Detail</div>
    </div>
  );
}
