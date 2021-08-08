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
  const [specialDrivers, setSpecialDrivers] = useState({});

  useEffect(() => {
    fireDB.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
      getOrders();
      getCustomers();
      getUsers();
      getSpecialDrivers();
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

  const getOrders = async () => {
    const ordersRef = fireDB.database().ref('Orders');
    await ordersRef.on('value', (snapshot) => {
      const ordersData = snapshot.val();
      const ordersList = [];
      for (let id in ordersData) {
        ordersList.push({ docId: id, ...ordersData[id] });
      }
      setOrders(ordersList);
    });
  };

  const getCustomers = async () => {
    const customers = fireDB.database().ref('Customers');
    await customers.on('value', (snapshot) => {
      const customers = snapshot.val();
      const customersList = [];
      for (let id in customers) {
        customersList.push({ docId: id, ...customers[id] });
      }
      setCustomers(customersList);
    });
  };

  const getUsers = async () => {
    const usersRef = fireDB.database().ref('Users');
    await usersRef.on('value', (snapshot) => {
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

  const getSpecialDrivers = async () => {
    const ref = fireDB.database().ref('SpecialDrivers');
    await ref.on('value', (snapshot) => {
      const specialDriversList = Object.entries(snapshot.val()).reduce(
        (acc, [id, { name }]) => {
          acc[id] = name;
          return acc;
        },
        {}
      );
      setSpecialDrivers(specialDriversList);
    });
  };

  useEffect(() => {
    getOrders();
    getCustomers();
    getUsers();
    getSpecialDrivers();
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
        specialDrivers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
