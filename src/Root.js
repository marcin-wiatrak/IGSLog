import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './Auth';
import PrivateRoute from './PrivateRoute';
import Biology from './Views/Biology';
import Dashboard from './Views/Dashboard';
import Fatherhood from './Views/Fatherhood';
import Login from './Views/Login';
import OrderDetails from './Views/OrderDetails';
import Physicochemistry from './Views/Physicochemistry';
import Toxicology from './Views/Toxicology';
import Customers from './Views/Customers';
import AdminPanel from './Views/AdminPanel';

const Root = () => {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/login" component={Login} />
          <PrivateRoute exact path="/" component={Dashboard} />
          <PrivateRoute
            exact
            path="/ustalanie_ojcostwa"
            component={Fatherhood}
          />
          <PrivateRoute exact path="/toksykologia" component={Toxicology} />
          <PrivateRoute
            exact
            path="/fizykochemia"
            component={Physicochemistry}
          />
          <PrivateRoute exact path="/biologia" component={Biology} />
          <PrivateRoute exact path="/zleceniodawcy" component={Customers} />
          <PrivateRoute exact path="/admin" component={AdminPanel} />
          <PrivateRoute
            exact
            path="/zlecenie/:orderId"
            component={OrderDetails}
          />
        </Switch>
      </Router>
    </AuthProvider>
  );
};

export default Root;
