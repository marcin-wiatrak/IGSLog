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
    const currentUserProfileRef = fireDB.database().ref('Users');
    currentUserProfileRef.on('value', (snapshot) => {
      const usersProfiles = snapshot.val();
      let usersProfilesArray = [];
      for (let userProfileId in usersProfiles) {
        usersProfilesArray.push({
          userProfileId,
          ...usersProfiles[userProfileId],
        });
      }
      if (currentUser) {
        const currentUserProfileFound = usersProfilesArray.find(
          (user) => user.id === currentUser.uid
        );
        setCurrentUserProfile(currentUserProfileFound);
      }
    });
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
