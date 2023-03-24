import { useEffect, useState } from 'react';
import styles from './Index.module.css';
import axios from 'axios';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import emailjs from 'emailjs-com';

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
}

export default function AdminMainPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currPage, setCurrPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(2);
  const [changes, setChanges] = useState(0);
  const [filterBy, setFilterBy] = useState('all');
  const [shops, setShops] = useState<Shop[]>([]);
  const [currPageShop, setCurrPageShop] = useState(1);
  const [totalPageShop, setTotalPageShop] = useState(0);
  const [offsetShop, setOffsetShop] = useState(0);
  const [limitShop, setLimitShop] = useState(2);
  const [notification, setNotification] = useState('');

  const GRAPHQLAPI = axios.create({ baseURL: 'http://localhost:8080/query' });
  const GET_USERS_QUERY = `query users($limit: Int, $offset: Int){
    users(limit: $limit, offset: $offset){
      id,
      firstName,
      lastName,
      email,
      phone,
      password,
      subscribe,
      banned,
      role,
      currency
    }
  }`;

  const UPDATE_BAN_MUTATION = `mutation updateBanStatus($userID: ID!, $banned: Boolean!){
    updateBanStatus(userID: $userID, banned: $banned){
      id,
      firstName,
      lastName,
      banned,
      email
    }
  }`;

  const GET_SHOPS_QUERY = `query shops($limit: Int, $offset: Int, $filter: String){
    shops(limit: $limit, offset: $offset, filter: $filter){
      id,
      name,
      image,
      banner,
      followers,
      salesCount,
      policy,
      aboutUs,
      banned,
      rating
    }
  }`;

  const UPDATE_SHOP_BAN_MUTATION = `mutation updateShopBanStatus($shopID: ID!, $banned: Boolean!){
    updateShopBanStatus(shopID: $shopID, banned: $banned){
      id,
      name,
      banned
    }
  }
  `;

  const CREATE_VOUCHER_MUTATION = `mutation createVoucher($currency: Float!){
    createVoucher(currency: $currency){
      id,
      currency,
      createdAt,
      valid
    }
  }`;

  useEffect(() => {
    GRAPHQLAPI.post('', {
      query: GET_USERS_QUERY,
    }).then((response) => {
      console.log(response);
      setAllUsers(response.data.data.users);
    });
  }, []);

  useEffect(() => {
    GRAPHQLAPI.post('', {
      query: GET_USERS_QUERY,
    }).then((response) => {
      console.log(response);
      setUsers(response.data.data.users);
      setTotalPage(Math.ceil(response.data.data.users.length / limit));
      setCurrPage(1);
      setOffset(0);
    });

    GRAPHQLAPI.post('', {
      query: GET_SHOPS_QUERY,
      variables: {
        filter: filterBy,
      },
    }).then((response) => {
      console.log(response);
      setShops(response.data.data.shops);
      setTotalPageShop(Math.ceil(response.data.data.shops.length / limitShop));
      setCurrPageShop(1);
      setOffsetShop(0);
    });
  }, [changes]);

  useEffect(() => {
    GRAPHQLAPI.post('', {
      query: GET_USERS_QUERY,
      variables: {
        limit: limit,
      },
    }).then((response) => {
      console.log(response);
      setUsers(response.data.data.users);
    });
  }, [limit]);

  useEffect(() => {
    GRAPHQLAPI.post('', {
      query: GET_SHOPS_QUERY,
      variables: {
        limit: limitShop,
      },
    }).then((response) => {
      console.log(response);
      setShops(response.data.data.shops);
    });
  }, [limitShop]);

  useEffect(() => {
    GRAPHQLAPI.post('', {
      query: GET_USERS_QUERY,
      variables: {
        limit: limit,
        offset: offset,
      },
    })
      .then((response) => {
        console.log(response);
        setUsers(response.data.data.users);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [totalPage, offset]);

  useEffect(() => {
    GRAPHQLAPI.post('', {
      query: GET_SHOPS_QUERY,
      variables: {
        limit: limitShop,
        offset: offsetShop,
      },
    })
      .then((response) => {
        console.log(response);
        setShops(response.data.data.shops);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [totalPageShop, offsetShop]);

  useEffect(() => {
    console.log('in');
    setOffset((currPage - 1) * limit);
  }, [currPage]);

  useEffect(() => {
    console.log('in');
    setOffsetShop((currPageShop - 1) * limitShop);
  }, [currPageShop]);

  useEffect(() => {
    setChanges(changes + 1);
  }, [filterBy]);

  const handlePrev = () => {
    if (currPage > 1) setCurrPage(currPage - 1);
  };

  const handleNext = () => {
    if (currPage < totalPage) setCurrPage(currPage + 1);
  };

  const handlePrevShop = () => {
    if (currPageShop > 1) setCurrPageShop(currPageShop - 1);
  };

  const handleNextShop = () => {
    if (currPageShop < totalPageShop) setCurrPageShop(currPageShop + 1);
  };

  const handleCreateVoucher = () => {
    GRAPHQLAPI.post('', {
      query: CREATE_VOUCHER_MUTATION,
      variables: {
        currency: (document.getElementById('currency') as HTMLInputElement)
          .value,
      },
    }).then((response) => {
      console.log(response);
      setNotification(
        `Voucher has been created with ID: ${response.data.data.createVoucher.id}`,
      );
    });
  };

  const handleBan = (user: User) => {
    GRAPHQLAPI.post('', {
      query: UPDATE_BAN_MUTATION,
      variables: {
        userID: user.id,
        banned: !user.banned,
      },
    }).then((response) => {
      console.log(response);
      setChanges(changes + 1);
    });
  };

  const handleShopBan = (shop: Shop) => {
    GRAPHQLAPI.post('', {
      query: UPDATE_SHOP_BAN_MUTATION,
      variables: {
        shopID: shop.id,
        banned: !shop.banned,
      },
    }).then((response) => {
      console.log(response);
      setChanges(changes + 1);
    });
  };

  const handleSendNews = () => {
    console.log(users);
    allUsers.map((s) => {
      if (s.subscribe) {
        console.log('test');
        const message = {
          from_name: 'NewEgg',
          message: 'NewsLetter \n\n Check Out Our Newest Promotion',
          email: s.email,
        };

        emailjs
          .send(
            'service_f6grouv',
            'template_hhticgf',
            message,
            'YxdxE8wQhw9aHzbgE',
          )
          .then(
            (response) => {
              console.log(response);
            },
            (error) => {
              console.log(error);
            },
          );
      }
    });
  };

  return (
    <div className={styles.body}>
      <div className={styles.title}>Admin Page</div>
      <div className={styles.user}>
        <h2 className={styles.title}>Manage User</h2>
        <div className={styles.sortByContainer}>
          <div className={styles.subContainer2}>
            <div className={styles.changepagecontainer}>
              {totalPage > 1 ? (
                <div className={styles.alignCenter}>
                  <button onClick={handlePrev} className={styles.paginationBTN}>
                    <FaAngleLeft />
                  </button>
                  <span>Page</span> {currPage + '/' + totalPage}
                  <button onClick={handleNext} className={styles.paginationBTN}>
                    <FaAngleRight />
                  </button>
                </div>
              ) : (
                <div>
                  <span>Page</span> <span>{currPage + '/' + totalPage}</span>
                </div>
              )}
            </div>
            <div className={styles.paginationcontainer}>
              <b>View:</b>
              <select
                value={limit}
                className={styles.forminputselection}
                onChange={(event) => {
                  setLimit(Number(event.target.value));
                }}
              >
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="6">6</option>
                <option value="8">8</option>
                <option value="50">50</option>
                <option value={users?.length}>All</option>
              </select>
            </div>
          </div>
        </div>
        <div className={styles.userContainer}>
          {users.map((u) => {
            return (
              <div key={u.id} className={styles.userItem}>
                <p>Name: {u.firstName + ' ' + u.lastName} </p>
                <p>Email: {u.email}</p>
                {u.banned ? (
                  <button className={styles.ban} onClick={() => handleBan(u)}>
                    UNBAN
                  </button>
                ) : (
                  <button className={styles.ban} onClick={() => handleBan(u)}>
                    BAN
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <button className={styles.orangeBTN} onClick={handleSendNews}>
          Send a new Newsletter
        </button>
      </div>
      <div className={styles.shop}>
        <div className={styles.title}>Manage Shop</div>
        <button onClick={() => (window.location.href = '/admin/insertShop')}>
          Insert New Shop
        </button>
        <div className={styles.sortByContainer}>
          <span>Filter By: </span>
          <select
            value={filterBy}
            onChange={(event) => {
              setFilterBy(event.target.value);
            }}
            className={styles.selectstyle}
          >
            <option value="all">All</option>
            <option value="banned">Banned</option>
            <option value="unbanned">Unbanned</option>
          </select>
        </div>
        <div className={styles.subContainer2}>
          <div className={styles.changepagecontainer}>
            {totalPageShop > 1 ? (
              <div className={styles.alignCenter}>
                <button
                  onClick={handlePrevShop}
                  className={styles.paginationBTN}
                >
                  <FaAngleLeft />
                </button>
                <span>Page</span> {currPageShop + '/' + totalPageShop}
                <button
                  onClick={handleNextShop}
                  className={styles.paginationBTN}
                >
                  <FaAngleRight />
                </button>
              </div>
            ) : (
              <div>
                <span>Page</span>{' '}
                <span>{currPageShop + '/' + totalPageShop}</span>
              </div>
            )}
          </div>
          <div className={styles.paginationcontainer}>
            <b>View:</b>
            <select
              value={limitShop}
              className={styles.forminputselection}
              onChange={(event) => {
                setLimitShop(Number(event.target.value));
              }}
            >
              <option value="2">2</option>
              <option value="4">4</option>
              <option value="6">6</option>
              <option value="8">8</option>
            </select>
          </div>
        </div>
        <div className={styles.shopContainer}>
          {shops.map((u) => {
            return (
              <div key={u.id} className={styles.userItem}>
                <img src={u.image} alt="" />
                <p>Name: {u.name}</p>
                {u.banned ? (
                  <button
                    className={styles.ban}
                    onClick={() => handleShopBan(u)}
                  >
                    UNBAN
                  </button>
                ) : (
                  <button
                    className={styles.ban}
                    onClick={() => handleShopBan(u)}
                  >
                    BAN
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.addNewVoucher}>
        <div className={styles.title}>Add New Voucher</div>
        <div className={styles.form}>
          <div className={styles.input}>
            <input type="text" id="currency" placeholder="Input Currency" />
            <button className={styles.orangeBTN} onClick={handleCreateVoucher}>
              Create
            </button>
          </div>
          <p>{notification}</p>
        </div>
      </div>
    </div>
  );
}
