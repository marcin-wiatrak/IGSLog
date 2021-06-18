import React, { useState } from 'react';
import MainWrapper from '../Components/MainWrapper/MainWrapper';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import fireDB from '../Firebase';
import usersFirebase from '../UsersFirebase';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    height: '100%',
  },
  paperHeader: {
    paddingBottom: theme.spacing(2),
    marginBottom: theme.spacing(1),
    borderBottom: '1px solid',
  },
  paperFooter: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  input: {
    width: '100%',
    margin: '8px 0',
  },
}));

const AdminPanel = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [emailToResetPassword, setEmailToResetPassword] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState('');

  const handleRegisterNewAccount = async (e) => {
    e.preventDefault();
    try {
      await usersFirebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      setEmail('');
      setPassword('');
      setSnackbar('ACC_CREATED');
    } catch (error) {
      setSnackbar('ACC_ERROR');
      console.log('error', error);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await fireDB.auth().sendPasswordResetEmail(emailToResetPassword);
      setEmailToResetPassword('');
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <MainWrapper>
      <Grid container spacing={3}>
        <Grid xs={4} item>
          <Paper square className={classes.paper}>
            <Typography variant="h5" gutterBottom>
              Tworzenie konta
            </Typography>
            <form onSubmit={handleRegisterNewAccount}>
              <TextField
                label="Adres E-mail"
                size="small"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={classes.input}
              />
              <TextField
                label="Hasło"
                size="small"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={classes.input}
              />
              <div className={classes.paperFooter}>
                <Button type="submit" variant="contained" color="primary">
                  Zarejestruj
                </Button>
              </div>
            </form>
          </Paper>
        </Grid>
        <Grid xs={4} item>
          <Paper square className={classes.paper}>
            <Typography variant="h5">Reset hasła</Typography>
            <form onSubmit={handleResetPassword}>
              <TextField
                label="Adres E-mail"
                size="small"
                variant="outlined"
                value={emailToResetPassword}
                onChange={(e) => setEmailToResetPassword(e.target.value)}
                className={classes.input}
              />
              <div className={classes.paperFooter}>
                <Button type="submit" variant="contained" color="primary">
                  Wyślij email
                </Button>
              </div>
            </form>
          </Paper>
        </Grid>
        <Grid xs={4} item>
          <Paper square className={classes.paper}>
            <Typography variant="h5">Lista pracowników</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={!!snackbar}
        autoHideDuration={6000}
        onClose={() => setSnackbar('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {snackbar === 'ACC_CREATED' ? (
          <Alert severity="success">Konto zostało utworzone pomyślnie!</Alert>
        ) : (
          <Alert severity="error">
            Nie udało się utworzyć konta! Konto istnieje lub hasło za krótkie.
          </Alert>
        )}
      </Snackbar>
    </MainWrapper>
  );
};

export default AdminPanel;
