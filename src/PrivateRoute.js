import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from './Auth';
import moment from 'moment';
import fireDB from './Firebase';
import { checkPermissions } from './utils';

const PrivateRoute = ({ component: RouteComponent, permission, ...rest }) => {
  const { currentUser, currentUserProfile } = useContext(AuthContext);
  const logoutTime = localStorage.getItem('logoutTime');
  return (
    <Route
      {...rest}
      render={(routeProps) => {
        if (logoutTime < moment().format() && currentUser) {
          fireDB.auth().signOut();
        }
        localStorage.setItem('logoutTime', moment().add(30, 'minutes').format());

        return !!currentUser &&
          checkPermissions(permission, currentUserProfile.permissions) ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={'/login'} />
        );
      }}
    />
  );
};

export default PrivateRoute;
