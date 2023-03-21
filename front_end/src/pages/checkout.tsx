import Navbar from '@/components/navbar';
import styles from '../styles/Checkout.module.css';
import FooterMain from '@/components/footerMain';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';
import {
  FaRegBuilding,
  FaPlus,
  FaCreditCard,
  FaBitcoin,
  FaPaypal,
  FaMoneyCheckAlt,
} from 'react-icons/fa';
import AddressCard from '@/components/addressCard';

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

interface Cart {
  product: Product;
  quantity: number;
  notes: string;
}

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

interface Delivery {
  id: string;
  name: string;
  price: number;
  description: string;
}

interface PaymentTypes {
  id: string;
  name: string;
}

export default function CheckOut() {
  const token = getCookie('jwt');
  const [carts, setCarts] = useState<Cart[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [changes, setChanges] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [paymentTypes, setPaymentTypes] = useState<PaymentTypes[]>([]);
  const [selected, setSelected] = useState<Delivery | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentTypes | null>(
    null,
  );
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [errroMsg, setErrorMsg] = useState('');
  const [user, setUser] = useState([]);
  const [superTotalPrice, setSuperTotalPrice] = useState(0);
  const [defaultAddress, setDefaultAddress] = useState<Address | null>(null);

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const CARTS_QUERY = `query{
    carts{
      product{
        id,
        name,
        images,
        price,
        discount,
        rating,
        stock,
        description,
      },
      quantity,
      notes
    }
  }`;

  const ADDRESSES_QUERY = `query{
    addresses{
      id,,
      firstName,
      lastName,
      user{
        id,
        firstName,
        lastName
      },
      company,
      country,
      phone,
      description,
      details,
      city,
      state,
      zipCode,
      addressAs,
      isDefault
    }
  }`;

  const CREATE_ADDRESS_MUTATION = `
    mutation createAddress($firstName:String!, $lastName: String!, $company: String, $country: String!, $phone: String!, $description: String!, $details: String!, $city: String!, $state: String!, $zipCode: String!, $addressAs: String!, $isDefault: Boolean!){
      createAddress(input: {
        firstName : $firstName,
        lastName: $lastName,
        company : $company,
        country : $country,
        phone: $phone,
        description: $description,
        details: $details,
        city: $city,
        state: $state,
        zipCode: $zipCode,
        addressAs: $addressAs,
        isDefault: $isDefault
      }){
        id,
        addressAs,
        isDefault
      }
    }`;

  const DELIVERIES_QUERY = `query{
      deliveries{
        id,
        name,
        price,
        description
      }
    }`;

  const PAYMENT_TYPES_QUERY = `query{
    paymentTypes{
      id,
      name
    }
  }`;

  const GET_CURRENT_USER = `query{
    getCurrentUser{
      id,
      firstName,
      lastName,
      currency
    }
  }`;

  const CHECKOUT_MUTATION = `mutation checkOut($deliveryID: ID!, $paymentTypeID:ID!, $addressID: ID!){
    checkout(deliveryID: $deliveryID, paymentTypeID:$paymentTypeID, addressID: $addressID){
      id,
      user{
        id,
        firstName,
        lastName
      },
      transactionDate,
      address{
        id,
        addressAs
      },
      transactionDetails{
        product{
          id,
          name,
          price
        }
        quantity
      },
      delivery{
        id,
        name
      },
      paymentType{
        name
      },
      invoice
    }
  }`;

  const UPDATE_CURRENCY_MUTATION = `mutation updateCurrency($currency: Float!){
    updateCurrency(currency: $currency){
      id,
      firstName,
      lastName,
      currency
    }
  }`;

  useEffect(() => {
    GRAPHQLAPI.post(
      '',
      {
        query: ADDRESSES_QUERY,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      setAddresses(response.data.data.addresses);
    });
  }, [changes]);

  useEffect(() => {
    GRAPHQLAPI.post(
      '',
      {
        query: CARTS_QUERY,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      console.log(response);
      setTotalPrice(0);
      setCarts(response.data.data.carts);
    });

    GRAPHQLAPI.post('', {
      query: DELIVERIES_QUERY,
    }).then((response) => {
      console.log(response);
      setDeliveries(response.data.data.deliveries);
    });

    GRAPHQLAPI.post('', {
      query: PAYMENT_TYPES_QUERY,
    }).then((response) => {
      console.log(response);
      setPaymentTypes(response.data.data.paymentTypes);
    });

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
    });
  }, [token]);

  useEffect(() => {
    carts.map((c) => {
      setTotalPrice(totalPrice + c.quantity * c.product.price);
    });
  }, carts);

  useEffect(() => {
    if (selected?.price) {
      setSuperTotalPrice(totalPrice + selected?.price);
    }
  }, [selected]);

  const openModal = () => {
    setIsOpen(true);
    console.log(isOpen);
  };

  const closeModal = () => {
    setIsOpen(false);
    console.log(isOpen);
  };

  const handleAddNewAddress = () => {
    openModal();
  };

  const handleSaveAddress = () => {
    const firstName = (document.getElementById('firstName') as HTMLInputElement)
      .value;
    const lastName = (document.getElementById('lastName') as HTMLInputElement)
      .value;
    const company = (document.getElementById('company') as HTMLInputElement)
      .value;
    const country = (document.getElementById('country') as HTMLInputElement)
      .value;
    const phone = (document.getElementById('phone') as HTMLInputElement).value;
    const description = (
      document.getElementById('description') as HTMLInputElement
    ).value;
    const details = (document.getElementById('details') as HTMLInputElement)
      .value;
    const city = (document.getElementById('city') as HTMLInputElement).value;
    const state = (document.getElementById('state') as HTMLInputElement).value;
    const zipCode = (document.getElementById('zipCode') as HTMLInputElement)
      .value;
    const addressAs = (document.getElementById('save') as HTMLInputElement)
      .value;
    const isDefault = (
      document.getElementById('makeDefault') as HTMLInputElement
    ).checked;

    GRAPHQLAPI.post(
      '',
      {
        query: CREATE_ADDRESS_MUTATION,
        variables: {
          firstName: firstName,
          lastName: lastName,
          company: company,
          country: country,
          phone: phone,
          description: description,
          details: details,
          city: city,
          state: state,
          zipCode: zipCode,
          addressAs: addressAs,
          isDefault: isDefault,
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
      closeModal();

      (document.getElementById('firstName') as HTMLInputElement).value = '';
      (document.getElementById('lastName') as HTMLInputElement).value = '';
      (document.getElementById('company') as HTMLInputElement).value = '';
      (document.getElementById('country') as HTMLInputElement).value = '';
      (document.getElementById('phone') as HTMLInputElement).value = '';
      (document.getElementById('description') as HTMLInputElement).value = '';
      (document.getElementById('details') as HTMLInputElement).value = '';
      (document.getElementById('city') as HTMLInputElement).value = '';
      (document.getElementById('state') as HTMLInputElement).value = '';
      (document.getElementById('zipCode') as HTMLInputElement).value = '';
      (document.getElementById('save') as HTMLInputElement).value = '';
      (document.getElementById('makeDefault') as HTMLInputElement).checked =
        false;
    });
  };

  const handleChanges = () => {
    setChanges(changes + 1);
    console.log('in');
  };

  const handleSelect = (delivery: Delivery) => {
    setSelected(delivery);
  };

  const handleSelectPayment = (payment: PaymentTypes) => {
    setSelectedPayment(payment);
  };
  const handleSelectAddress = (address: Address) => {
    setSelectedAddress(address);
  };

  const handleCheckOut = () => {
    if (selectedPayment == null) {
      setErrorMsg('Please select a payment method');
    } else {
      if (user.currency < totalPrice) {
        setErrorMsg('Your balance is insufficient');
      } else {
        setErrorMsg('');
        const addressID = selectedAddress
          ? selectedAddress.id
          : defaultAddress?.id;
        const deliveryID = selected?.id ? selected.id : '1';
        console.log(deliveryID);
        console.log(selectedPayment?.id);
        console.log(defaultAddress);
        GRAPHQLAPI.post(
          '',
          {
            query: CHECKOUT_MUTATION,
            variables: {
              deliveryID: deliveryID,
              paymentTypeID: selectedPayment.id,
              addressID: addressID,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ).then((response) => {
          console.log(response);
          GRAPHQLAPI.post(
            '',
            {
              query: UPDATE_CURRENCY_MUTATION,
              variables: {
                currency: superTotalPrice,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          ).then((response) => {
            console.log(response);
            // window.location.href =
          });
        });
      }
    }
  };

  return (
    <div
      className={`${styles['body']} ${isOpen ? styles['open'] : styles['']}`}
    >
      <div className={styles.background} onClick={closeModal}></div>
      <div
        className={`${styles.modal} ${isOpen ? styles['open'] : styles['']}`}
      >
        <p className={styles.titleModal}>Add Address</p>
        <div className={styles.modalBody}>
          <div className={styles.form}>
            <div className={styles.scroll}>
              <div className={styles.nameContainer}>
                <div className={styles.row}>
                  <label htmlFor="firstName">First Name</label>
                  <input type="text" id="firstName" />
                </div>
                <div className={styles.row}>
                  <label htmlFor="lastName">Last Name</label>
                  <input type="text" id="lastName" />
                </div>
              </div>
              <div className={styles.company}>
                <label htmlFor="company">Company (Optional)</label>
                <input type="text" id="company" />
              </div>
              <div className={styles.country}>
                <div className={styles.row}>
                  <label htmlFor="country">Country / Region</label>
                  <input type="text" id="country" />
                </div>
                <div className={styles.row}></div>
              </div>
              <div className={styles.phone}>
                <div className={styles.row}>
                  <label htmlFor="phone">Phone</label>
                  <input type="text" id="phone" />
                </div>
                <div className={styles.row}></div>
              </div>
              <div className={styles.address}>
                <label htmlFor="">Address</label>
                <input
                  type="text"
                  id="description"
                  placeholder="Start typing your address to search"
                  className={styles.marginBot}
                />
                <input
                  type="text"
                  id="details"
                  placeholder="Apartment, suite, unit, building, floor, etc."
                />
              </div>
              <div className={styles.addressDetails}>
                <div className={styles.details}>
                  <label htmlFor="city">City</label>
                  <input type="text" id="city" />
                </div>
                <div className={styles.details}>
                  <label htmlFor="state">State</label>
                  <input type="text" id="state" />
                </div>
                <div className={styles.details}>
                  <label htmlFor="zipCode">ZIP Code</label>
                  <input type="text" id="zipCode" />
                </div>
              </div>
              <div className={styles.saveAddressAs}>
                <div className={styles.saveContainer}>
                  <label htmlFor="save">Save Address As</label>
                  <input type="text" id="save" placeholder="Untitled" />
                </div>
                <div>
                  <input type="checkbox" name="saveAddress" id="saveAddress" />
                  <label htmlFor="saveAddress">Save Address</label>
                </div>
                <div>
                  <input type="checkbox" name="makeDefault" id="makeDefault" />
                  <label htmlFor="makeDefault">Make Default</label>
                </div>
              </div>
            </div>
            <hr className={styles.divider} />
            <div className={styles.actionBTN}>
              <button onClick={closeModal}>CANCEL</button>
              <button className={styles.orangeBTN} onClick={handleSaveAddress}>
                SAVE
              </button>
            </div>
          </div>
        </div>
      </div>
      <Navbar />
      <div className={styles.pageSectionInner}>
        <div className={styles.title}>
          Check Out (
          <span className={styles.itemCount}>{carts.length} item(s)</span>)
        </div>
        <div className={styles.rowInner}>
          <div className={styles.rowBody}>
            <div className={styles.shipItemCell}>
              <div className={styles.checkOutStep}>
                <div className={styles.checkOutStepTitle}>
                  <div className={styles.number}>1</div>
                  <h2>Shipping</h2>
                </div>
                <div className={styles.checkOutStepBody}>
                  <div className={styles.checkOutTabs}>
                    <div className={styles.checkOutTabsTop}>
                      <p>How would you like to get your order</p>
                      <div className={styles.option}>
                        <div>
                          <div>Ship to</div>
                          <div className={styles.orangeColor}>
                            Your Location
                          </div>
                        </div>
                        <FaRegBuilding />
                      </div>
                    </div>
                    <div className={styles.checkOutTabContent}>
                      <div>Ship to Your Location</div>
                      <p>
                        Have your order delivered to your home, office or
                        anywhere.
                        <br />
                        We work with a number of different carriers & will ship
                        via the one who can best meet your delivery needs.
                      </p>
                      <div className={styles.marginTop}>
                        <button onClick={handleAddNewAddress}>
                          <FaPlus /> ADD NEW ADDRESS
                        </button>
                      </div>
                      {addresses.map((a) => {
                        return (
                          <div
                            className={`${styles['addressCardContainer']} ${
                              selectedAddress == a ? styles.selectedAddress : ''
                            }`}
                            onClick={() => handleSelectAddress(a)}
                            key={a.id}
                          >
                            <AddressCard
                              address={a}
                              key={a.id}
                              handleChanges={handleChanges}
                              setDefaultAddress={setDefaultAddress}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.deliveryItemCell}>
              <div className={styles.checkOutStep}>
                <div className={styles.checkOutStepTitle}>
                  <div className={styles.number}>2</div>
                  <h2>DELIVERY</h2>
                </div>
                {carts.map((c) => {
                  return (
                    <div className={styles.checkOutStepBody} key={c.product.id}>
                      <div className={styles.checkOutTabs}>
                        <div className={styles.checkOutTabsTop}>
                          <p className={styles.groupTitle}>
                            Newegg International Shipping Service (
                            {deliveries.length}{' '}
                            {deliveries.length == 1 ? (
                              <span>Item</span>
                            ) : (
                              <span>Items</span>
                            )}
                            )
                          </p>
                          <div className={styles.tabsTitle}>
                            How soon you would like to receive the products
                          </div>
                        </div>
                        <div className={styles.checkOutTabContent}>
                          <div className={styles.productContainer}>
                            <img src={c.product.images} alt="Product Image" />
                            <div className={styles.productInfo}>
                              <p>{c.product.name}</p>
                              <p>{c.product.description}</p>
                            </div>
                            <div className={styles.productQty}>
                              {c.quantity}
                            </div>
                            <div className={styles.productPrice}>
                              ${(c.quantity * c.product.price).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className={styles.showMoreBox}>
                {deliveries.map((d) => {
                  return (
                    <div
                      className={`${styles['itemCell']} ${
                        selected?.id === d.id ? styles.selected : ''
                      }`}
                      onClick={() => handleSelect(d)}
                      key={d.id}
                    >
                      <div className={styles.deliveryDetails}>
                        {d.name}
                        <br />
                        {d.description}
                      </div>
                      {d.price == 0 ? (
                        <div className={styles.deliveryPrice}>FREE</div>
                      ) : (
                        <div className={styles.deliveryPrice}>
                          ${d.price.toFixed(2)}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div></div>
              </div>
            </div>
            <div className={styles.paymentItemCell}>
              <div className={styles.checkOutStep}>
                <div className={styles.checkOutStepTitle}>
                  <div className={styles.number}>3</div>
                  <h2>PAYMENT</h2>
                </div>
                <div className={styles.checkOutTabsTop}>
                  <div>How do you want to pay?</div>
                  <div className={styles.showMoreBox}>
                    {paymentTypes.map((p) => {
                      return (
                        <div
                          className={`${styles['payItemCell']} ${
                            selectedPayment?.id === p.id
                              ? styles.selectedPay
                              : ''
                          }`}
                          onClick={() => handleSelectPayment(p)}
                          key={p.id}
                        >
                          <div>{p.name}</div>
                          {p.id === '1' && <FaCreditCard />}
                          {p.id === '2' && <FaBitcoin />}
                          {p.id === '3' && <FaPaypal />}
                          {p.id === '4' && <FaMoneyCheckAlt />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.rowSide}>
            <h3>Order Summary</h3>
            <div className={styles.summaryWrap}>
              <div className={styles.summaryContent}>
                <ul>
                  <li>
                    <div>Item(s): </div>
                    <span>${totalPrice}</span>
                  </li>
                  <li>
                    <div>Delivery:</div>
                    <span>${selected?.price}</span>
                  </li>
                  <hr />
                  <li className={styles.totalPrice}>
                    <div>Total:</div>

                    {selected?.price ? (
                      <span>${superTotalPrice}</span>
                    ) : (
                      <span>${totalPrice}</span>
                    )}
                  </li>
                </ul>
                <div className={styles.reviewBTN}>
                  <button className={styles.orangeBTN} onClick={handleCheckOut}>
                    Review Your Order
                  </button>
                </div>
                <p className={styles.error}>{errroMsg}</p>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <FooterMain />
    </div>
  );
}
