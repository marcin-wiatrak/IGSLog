import React, { useEffect, useState } from 'react';
import fireDB from './Firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);
  const lsUser = localStorage.getItem('authToken');

  useEffect(() => {
    if (!lsUser) fireDB.auth().signOut();
    fireDB.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) setLocalStorage(user);
      setPending(false);
    });
  }, []);

  const setLocalStorage = (user) => {
    localStorage.setItem('authToken', user.uid);
  };

  if (pending) {
    return <>Loading...</>;
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
