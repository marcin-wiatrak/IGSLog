import React, { useEffect, useState } from 'react';
import fireDB from './Firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState({});
  const [pending, setPending] = useState(true);

  useEffect(() => {
    fireDB.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
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

  if (pending) return <>Loading...</>;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
