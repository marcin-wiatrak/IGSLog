import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from './Auth';
import moment from 'moment';
import fireDB from './Firebase';

const PrivateRoute = ({ component: RouteComponent, ...rest }) => {
  const { currentUser } = useContext(AuthContext);
  const logoutTime = localStorage.getItem('logoutTime');
  return (
    <Route
      {...rest}
      render={(routeProps) => {
        if (logoutTime < moment().format() && currentUser) {
          fireDB.auth().signOut();
        }
        localStorage.setItem(
          'logoutTime',
          moment().add(20, 'minutes').format()
        );
        return !!currentUser ? (
          <RouteComponent {...routeProps} />
        ) : (
          <Redirect to={'/login'} />
        );
      }}
    />
  );
};

export default PrivateRoute;
