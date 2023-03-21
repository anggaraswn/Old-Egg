import axios from 'axios';
import styles from './AddressCard.module.css';
import { getCookie } from 'cookies-next';

interface Address {
  id: string;
  // user: User! @goField(forceResolver: true)
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  phone: string;
  description: string;
  details: string;
  city: string;
  state: string;
  zipCode: string;
  addressAs: string;
  isDefault: boolean;
}

export default function AddressCard(props: {
  address: Address;
  handleChanges: Function;
  setDefaultAddress: Function;
}) {
  const { address, handleChanges, setDefaultAddress } = props;
  const token = getCookie('jwt');
  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const DELETE_ADDRESS_MUATION = `mutation deleteAddress($addressID: ID!){
    deleteAddress(addressID: $addressID){
      id,
      description,
      addressAs
    }
  }`;
  const handleRemoveAddress = () => {
    GRAPHQLAPI.post(
      '',
      {
        query: DELETE_ADDRESS_MUATION,
        variables: {
          addressID: address.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      handleChanges();
    });
  };

  if (address.isDefault) {
    setDefaultAddress(address);
  }

  return (
    <div
      className={`${styles[address.isDefault ? 'default' : 'cardContainer']}`}
    >
      <div className={styles.addressAs}>{address.addressAs}</div>
      <div className={styles.name}>
        {address.firstName}&nbsp; {address.lastName}
      </div>
      <div>{address.description}</div>
      <div>{address.zipCode}</div>
      <div>{address.country}</div>
      <div>{address.phone}</div>
      <div className={styles.action}>
        {address.isDefault ? (
          <button className={styles.defaultBTN}>DEFAULT</button>
        ) : (
          <button>Make as default</button>
        )}
        <div className={styles.btnContainer}>
          <button>EDIT</button>
          <button onClick={handleRemoveAddress}>REMOVE</button>
        </div>
      </div>
    </div>
  );
}
