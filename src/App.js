import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Views/Login';
import Root from './Root';
import { AuthProvider } from './Auth';
import { DataProvider } from './Data';

const App = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/" component={Root} />
          </Switch>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
