import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './Auth';
import PrivateRoute from './PrivateRoute';
import UserProfile from './Views/UserProfile';
import Biology from './Views/Biology';
import Dashboard from './Views/Dashboard';
import Fatherhood from './Views/Fatherhood';
import Login from './Views/Login';
import OrderDetails from './Views/OrderDetails';
import Physicochemistry from './Views/Physicochemistry';
import Toxicology from './Views/Toxicology';
import Customers from './Views/Customers';
import AdminPanel from './Views/AdminPanel';
import React from 'react';
import { DataProvider } from './Data';
import { Redirect } from 'react-router';

const Root = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/login" />} />
            <Route
              exact
              path="/login"
              render={() => {
                localStorage.clear();
                return <Login />;
              }}
            />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute
              exact
              path="/ustalanie_ojcostwa"
              component={Fatherhood}
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
            />
            <PrivateRoute exact path="/biologia" component={Biology} />
            <PrivateRoute exact path="/zleceniodawcy" component={Customers} />
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
            />
            <PrivateRoute exact path="/profil" component={UserProfile} />
          </Switch>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
};

export default Root;
