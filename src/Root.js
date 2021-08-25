import { Route, Switch } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import UserProfile from './Views/UserProfile';
import Biology from './Views/Biology';
import Dashboard from './Views/Dashboard';
import Fatherhood from './Views/Fatherhood';
import OrderDetails from './Views/OrderDetails';
import Physicochemistry from './Views/Physicochemistry';
import Toxicology from './Views/Toxicology';
import Customers from './Views/Customers';
import AdminPanel from './Views/AdminPanel';
import React, { useContext } from 'react';
import { Redirect } from 'react-router';
import { DataContext } from './Data';

const Root = () => {
  const { dataReady } = useContext(DataContext);

  if (!localStorage.getItem('authToken')) return <Redirect to={'/login'} />;

  return (
    <Switch>
      <Route
        exact
        path="/"
        render={() => (
          <Redirect
            to={localStorage.getItem('authToken') ? '/dashboard' : '/login'}
          />
        )}
      />
      <Route exact path="/dashboard" component={Dashboard} />
      <PrivateRoute
        exact
        path="/ustalanie_ojcostwa"
        component={Fatherhood}
        permission="user"
      />
      <PrivateRoute
        exact
        path="/toksykologia"
        component={Toxicology}
        permission="user"
      />
      <PrivateRoute
        exact
        path="/fizykochemia"
        component={Physicochemistry}
        permission="user"
      />
      <PrivateRoute
        exact
        path="/biologia"
        component={Biology}
        permission="user"
      />
      <PrivateRoute
        exact
        path="/zleceniodawcy"
        component={Customers}
        permission="user"
      />
      <PrivateRoute
        exact
        path="/admin"
        component={AdminPanel}
        permission="admin"
      />
      <PrivateRoute
        exact
        path="/zlecenie/:orderId"
        component={OrderDetails}
        permission="user"
      />
      <PrivateRoute
        exact
        path="/profil"
        component={UserProfile}
        permission="user"
      />
    </Switch>
  );
};

export default Root;
