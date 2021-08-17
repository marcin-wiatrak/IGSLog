import React, { useEffect, useState } from 'react';
import fireDB from './Firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fireDB.auth().onAuthStateChanged((user) => {
      if (user) {
        const currentUserProfileRef = fireDB
          .database()
          .ref(`Users/${user.uid}`);
        currentUserProfileRef.on('value', (snapshot) => {
          const result = snapshot.val();
          setCurrentUserProfile(result);
          setCurrentUser(user);
        });
      } else {
        setCurrentUser(null);
        setCurrentUserProfile(null);
      }
    });
    setPending(false);
  }, []);

  useEffect(() => {
    if (currentUser && currentUserProfile) {
      setPending(false);
    }
  }, [currentUser, currentUserProfile]);

  if (pending) return <>Ładowanie danych użytkownika</>;

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
