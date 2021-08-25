import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { checkPermissions } from './utils';
import { DataContext } from './Data';
import { AuthContext } from './Auth';

const PrivateRoute = ({
  permission,
  component: Component,
  params,
  ...rest
}) => {
  const { currentUserProfile, dataReady } = useContext(DataContext);
  const { currentUser } = useContext(AuthContext);
  return currentUser &&
    dataReady &&
    checkPermissions(permission, currentUserProfile.permissions) ? (
    <Route {...rest} render={(props) => <Component {...props} {...params} />} />
  ) : (
    <Redirect to="/" />
  );
};

export default PrivateRoute;
