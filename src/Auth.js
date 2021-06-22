import React, { useEffect, useState } from 'react';
import fireDB from './Firebase';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserProfile, setCurrentUserProfile] = useState({});
  const [pending, setPending] = useState(true);
  const [usersList, setUsersList] = useState({});

  useEffect(() => {
    fireDB.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
    });
  }, []);

  useEffect(() => {
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
        usersList,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
