import React, { useState } from 'react';
import MainWrapper from '../Components/MainWrapper/MainWrapper';
import {
  Button,
  Grid,
  makeStyles,
  Paper,
  TextField,
  Typography,
} from '@material-ui/core';
import fireDB from '../Firebase';

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
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await fireDB.auth().createUserWithEmailAndPassword(email, password);
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
            <form onSubmit={handleRegister}>
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
          </Paper>
        </Grid>
        <Grid xs={4} item>
          <Paper square className={classes.paper}>
            <Typography variant="h5">Lista pracowników</Typography>
          </Paper>
        </Grid>
      </Grid>
    </MainWrapper>
  );
};

export default AdminPanel;
