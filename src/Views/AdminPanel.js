import React, { useContext, useState } from 'react';
import MainWrapper from '../Components/MainWrapper/MainWrapper';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  List,
  ListItem,
  makeStyles,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@material-ui/core';
import fireDB from '../Firebase';
import usersFirebase from '../UsersFirebase';
import { Alert } from '@material-ui/lab';
import { AuthContext } from '../Auth';
import { typeTranslation } from '../dict';

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
  heading: {
    fontWeight: 'bold',
  },
}));

const AdminPanel = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [emailToResetPassword, setEmailToResetPassword] = useState('');
  const [password, setPassword] = useState('');
  const [snackbar, setSnackbar] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [idToRemove, setIdToRemove] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [orderToRemove, setOrderToRemove] = useState(null);

  const { usersList, orders, customersList } = useContext(AuthContext);

  console.log(usersList);
  console.log(customersList);

  const handleRegisterNewAccount = async (e) => {
    e.preventDefault();
    try {
      await usersFirebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((data) => {
          fireDB
            .database()
            .ref(`/Users/${data.user.uid}`)
            .set({
              firstName,
              lastName,
              email,
              initials: `${firstName[0]}${lastName[0]}`,
            })
            .then(() => {
              setEmail('');
              setPassword('');
              setFirstName('');
              setLastName('');
              setSnackbar('ACC_CREATED');
            });
        });
    } catch (error) {
      setSnackbar('ACC_ERROR');
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

  const deleteTaskDialogOpen = (e) => {
    e.preventDefault();
    const findOrderWithId = orders.find(
      (order) => order.id === parseInt(idToRemove)
    );
    console.log(findOrderWithId);
    if (findOrderWithId) {
      setOrderToRemove(findOrderWithId);
      setDialogOpen(true);
    } else {
      setSnackbar('ORDER_NOTFOUND');
    }
  };

  const deleteTaskDialogClose = () => setDialogOpen(false);

  const deleteTaskHandler = () => {
    deleteTaskDialogClose();
    const ref = fireDB.database().ref('Orders').child(orderToRemove.docId);
    ref.remove().then(() => {
      setSnackbar('ORDER_DELETED');
      setIdToRemove('');
      setOrderToRemove('');
    });
  };

  const renderSnackbarText = () => {
    switch (snackbar) {
      case 'ACC_CREATED':
        return (
          <Alert severity="success">Konto zostało utworzone pomyślnie!</Alert>
        );
      case 'ORDER_DELETED':
        return (
          <Alert severity="success">Zlecenie zostało pomyślnie usunięte!</Alert>
        );
      case 'ERROR':
        return (
          <Alert severity="error">
            Nie udało się utworzyć konta! Konto istnieje lub hasło za krótkie.
          </Alert>
        );
      case 'ORDER_NOTFOUND':
        return (
          <Alert severity="error">Nie znaleziono zlecenia o podanym ID</Alert>
        );
      default:
        return <Alert />;
    }
  };

  return (
    <MainWrapper>
      <Typography
        variant="h4"
        color="textSecondary"
        gutterBottom
        className={classes.heading}
      >
        PANEL ADMINISTRACYJNY
      </Typography>
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
              <TextField
                label="Imię"
                size="small"
                variant="outlined"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={classes.input}
              />
              <TextField
                label="Nazwisko"
                size="small"
                variant="outlined"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
            <Typography variant="h5">Lista pracowników:</Typography>
            <div>
              {Object.entries(usersList).map(([uId, name], index) => (
                <Typography key={uId}>{`${index + 1}. ${name}`}</Typography>
              ))}
            </div>
          </Paper>
        </Grid>
        <Grid xs={4} item>
          <Paper square className={classes.paper}>
            <Typography variant="h5">Usuwanie zlecenia:</Typography>
            <form onSubmit={deleteTaskDialogOpen}>
              <TextField
                label="#ID zlecenia do usunięcia"
                size="small"
                variant="outlined"
                value={idToRemove}
                onChange={(e) => setIdToRemove(e.target.value)}
                className={classes.input}
              />
              <div className={classes.paperFooter}>
                <Button type="submit" variant="contained" color="primary">
                  Usuń zlecenie
                </Button>
              </div>
            </form>
          </Paper>
        </Grid>
      </Grid>
      <Dialog
        open={dialogOpen}
        onClose={deleteTaskDialogClose}
        disableBackdropClick
        PaperProps={{ square: true }}
      >
        <DialogTitle>Usuwanie zlecenia</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Zamierzasz usunąć zlecenie o ID {idToRemove}
          </DialogContentText>
          {orderToRemove && (
            <List>
              <ListItem>Sygnatura: {orderToRemove.signature}</ListItem>
              <ListItem>
                Zleceniodawca: {customersList[orderToRemove.customer]}
              </ListItem>
              <ListItem>
                Osoba odp.: {usersList[orderToRemove.employee]}
              </ListItem>
              <ListItem>
                Odbiorca: {usersList[orderToRemove.employeeDriver] || 'brak'}
              </ListItem>
              <ListItem>Typ: {typeTranslation[orderToRemove.type]}</ListItem>
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteTaskDialogClose} color="primary">
            Anuluj
          </Button>
          <Button
            onClick={deleteTaskHandler}
            color="primary"
            variant="contained"
          >
            Usuń
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={!!snackbar}
        autoHideDuration={6000}
        onClose={() => setSnackbar('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <>{renderSnackbarText()}</>
      </Snackbar>
    </MainWrapper>
  );
};

export default AdminPanel;
