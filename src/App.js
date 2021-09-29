import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Views/Login';
import Root from './Root';
import { AuthProvider } from './Auth';
import { DataProvider } from './Data';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

const App = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <MuiPickersUtilsProvider utils={MomentUtils} locale="pl">
          <Router>
            <Switch>
              <Route path="/login" component={Login} />
              <Route path="/" component={Root} />
            </Switch>
          </Router>
        </MuiPickersUtilsProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
