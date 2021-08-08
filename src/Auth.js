import React, { useEffect, useState } from 'react';
import fireDB from './Firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState({});
  const [pending, setPending] = useState(true);
  const [usersList, setUsersList] = useState({});
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState();

  useEffect(() => {
    fireDB.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
      getOrders();
      getCustomers();
      getUsers();
    });
  }, []);

  useEffect(() => {
    if (currentUser) {
      const currentUserProfileRef = fireDB
        .database()
        .ref(`Users/${currentUser.uid}`);
      currentUserProfileRef.on('value', (snapshot) =>
        setCurrentUserProfile(snapshot.val())
      );
    }
  }, [currentUser]);

  const getOrders = () => {
    const ordersRef = fireDB.database().ref('Orders');
    ordersRef.on('value', (snapshot) => {
      const ordersData = snapshot.val();
      const ordersList = [];
      for (let id in ordersData) {
        ordersList.push({ docId: id, ...ordersData[id] });
      }
      setOrders(ordersList);
    });
  };

  const getCustomers = () => {
    const customers = fireDB.database().ref('Customers');
    customers.on('value', (snapshot) => {
      const customers = snapshot.val();
      const customersList = [];
      for (let id in customers) {
        customersList.push({ docId: id, ...customers[id] });
      }
      setCustomers(customersList);
    });
  };

  const getUsers = () => {
    const usersRef = fireDB.database().ref('Users');
    usersRef.on('value', (snapshot) => {
      const usersData = Object.entries(snapshot.val()).reduce(
        (acc, [id, user]) => {
          acc[id] = `${user.firstName} ${user.lastName}`;
          return acc;
        },
        {}
      );
      setUsersList(usersData);
    });
  };

  useEffect(() => {
    getOrders();
    getCustomers();
    getUsers();
  }, []);

  const customersList = customers.reduce((acc, item) => {
    acc[item.customerId] = item.companyName;
    return acc;
  }, {});

  if (pending) return <>Loading...</>;

  return (
    <AuthContext.Provider
      value={{
        customersList,
        orders,
        customers,
        currentUser,
        currentUserProfile,
        usersList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
