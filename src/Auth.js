import React, { useEffect, useState } from 'react';
import fireDB from './Firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    fireDB.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      if (user) localStorage.setItem('authToken', user.uid);
      setPending(false);
    });
  }, []);

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

// const currentUserProfileRef = fireDB
//   .database()
//   .ref(`Users/${user.uid}`);
// currentUserProfileRef.on('value', (snapshot) => {
//   const result = snapshot.val();
//   setCurrentUserProfile(result);
