import {
  Button,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import { AlternateEmail, Lock, PlayArrow } from '@material-ui/icons';
import { useState, useContext } from 'react';
import { Redirect } from 'react-router';
import { AuthContext } from '../Auth';
import fireDB from '../Firebase';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  },
  formWrapper: {
    padding: theme.spacing(4),
    display: 'inline-flex',
    flexDirection: 'column',
    width: 400,
    '& .MuiTextField-root, & .MuiButton-root': {
      margin: '8px 0',
    },
    '& > form': {
      display: 'inline-flex',
      flexDirection: 'column',
    },
  },
}));

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await fireDB.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      error.code.includes('too-many-requests')
        ? setLoginError(
            'Zbyt wiele prób logowania. Spróbuj ponownie za 5 minut lub zmień hasło aby odblokować konto.'
          )
        : setLoginError('Błędny email lub hasło');
    }
  };

  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <div className={classes.root}>
      <Paper square className={classes.formWrapper}>
        <Typography variant="h4" gutterBottom align="center">
          Logowanie
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            type="email"
            variant="outlined"
            size="small"
            placeholder="Adres E-mail"
            padding="small"
            value={email}
            onKeyDown={() => loginError && setLoginError('')}
            onChange={(e) => setEmail(e.target.value)}
            error={!!loginError}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AlternateEmail fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            variant="outlined"
            type="password"
            placeholder="Hasło"
            size="small"
            error={!!loginError}
            value={password}
            onKeyDown={() => loginError && setLoginError('')}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          {loginError && (
            <Typography variant="body2" color="error" align="center">
              {loginError}
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={!email || !password}
            endIcon={<PlayArrow size="small" />}
          >
            Zaloguj się
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default Login;
