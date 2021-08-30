import React, { useContext, useEffect, useState } from 'react';
import fireDB from './Firebase';
import { AuthContext } from './Auth';

export const DataContext = React.createContext();

export const DataProvider = ({ children }) => {
  const [usersList, setUsersList] = useState(null);
  const [customers, setCustomers] = useState();
  const [customersList, setCustomersList] = useState();
  const [orders, setOrders] = useState();
  const [specialDrivers, setSpecialDrivers] = useState();
  const [rawUsersList, setRawUsersList] = useState();
  const [currentUserProfile, setCurrentUserProfile] = useState();
  const [dataReady, setDataReady] = useState(false);

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      getUserDetails();
      getOrders();
      getCustomers();
      getUsers();
      getSpecialDrivers();
    }
  }, [currentUser]);

  const getUserDetails = async () => {
    const ref = await fireDB.database().ref(`Users/${currentUser.uid}`);
    ref.on('value', (snapshot) => {
      const val = snapshot.val();
      setCurrentUserProfile(val);
    });
  };

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
      getCustomersList(customersList);
    });
  };

  const getCustomersList = (customerss) => {
    const list = customerss.reduce((acc, item) => {
      acc[item.customerId] = item.companyName;
      return acc;
    }, {});
    setCustomersList(list);
  };

  const getUsers = async () => {
    const usersRef = fireDB.database().ref('Users');
    await usersRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const usersData = Object.entries(data).reduce((acc, [id, user]) => {
        acc[id] = `${user.firstName} ${user.lastName}`;
        return acc;
      }, {});
      setRawUsersList(data);
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
    if (
      usersList &&
      customers &&
      customersList &&
      orders &&
      specialDrivers &&
      currentUserProfile
    ) {
      setDataReady(true);
    }
  }, [
    usersList,
    customers,
    customersList,
    orders,
    specialDrivers,
    currentUserProfile,
  ]);

  // if (!dataReady) return <>Ładowanie danych...</>;

  return (
    <DataContext.Provider
      value={{
        customersList,
        orders,
        customers,
        usersList,
        specialDrivers,
        rawUsersList,
        currentUserProfile,
        dataReady,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
