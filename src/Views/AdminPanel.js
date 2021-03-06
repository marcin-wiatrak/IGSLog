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
import { typeTranslation } from '../dict';
import { DataContext } from '../Data';

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
  const [specialDriverName, setSpecialDriverName] = useState('');

  const {
    rawUsersList,
    usersList,
    orders,
    customersList,
    specialDrivers,
  } = useContext(DataContext);

  const addSpecialDriversHandler = (e) => {
    e.preventDefault();
    const ref = fireDB.database().ref('SpecialDrivers');
    const specialDriverData = {
      name: specialDriverName,
    };
    ref.push(specialDriverData);
    setSpecialDriverName('');
    setSnackbar('SPECIALDRIVER_ADDED');
  };

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
              uId: data.user.uid,
              permissions: ['user'],
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
          <Alert severity="success">Konto zosta??o utworzone pomy??lnie!</Alert>
        );
      case 'ORDER_DELETED':
        return (
          <Alert severity="success">Zlecenie zosta??o pomy??lnie usuni??te!</Alert>
        );
      case 'ERROR':
        return (
          <Alert severity="error">
            Nie uda??o si?? utworzy?? konta! Konto istnieje lub has??o za kr??tkie.
          </Alert>
        );
      case 'ORDER_NOTFOUND':
        return (
          <Alert severity="error">Nie znaleziono zlecenia o podanym ID</Alert>
        );
      case 'SPECIALDRIVER_ADDED':
        return (
          <Alert severity="success">Odbiorca specjalny dodany pomy??lnie!</Alert>
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
                label="Has??o"
                size="small"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={classes.input}
              />
              <TextField
                label="Imi??"
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
            <Typography variant="h5">Reset has??a</Typography>
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
                  Wy??lij email
                </Button>
              </div>
            </form>
          </Paper>
        </Grid>
        <Grid xs={4} item>
          <Paper square className={classes.paper}>
            <Typography variant="h5">Lista pracownik??w:</Typography>
            <div>
              {Object.entries(rawUsersList)
                .filter(([uId, user]) => !user.hidden)
                .map(([uId, user], index) => (
                <Typography key={uId}>{`${index + 1}. ${user.firstName} ${user.lastName}`}</Typography>
              ))}
            </div>
          </Paper>
        </Grid>
        <Grid xs={4} item>
          <Paper square className={classes.paper}>
            <Typography variant="h5">Usuwanie zlecenia</Typography>
            <form onSubmit={deleteTaskDialogOpen}>
              <TextField
                label="#ID zlecenia do usuni??cia"
                size="small"
                variant="outlined"
                value={idToRemove}
                onChange={(e) => setIdToRemove(e.target.value)}
                className={classes.input}
              />
              <div className={classes.paperFooter}>
                <Button type="submit" variant="contained" color="primary">
                  Usu?? zlecenie
                </Button>
              </div>
            </form>
          </Paper>
        </Grid>
        <Grid xs={4} item>
          <Paper square className={classes.paper}>
            <Typography variant="h5">Odbiorcy specjalni</Typography>
            {Object.entries(specialDrivers).map(([id, item], index) => (
              <Typography key={id}>{`${index + 1}. ${item}`}</Typography>
            ))}
            <form onSubmit={addSpecialDriversHandler}>
              <TextField
                label="Nazwa odbiorcy specjalnego"
                size="small"
                variant="outlined"
                value={specialDriverName}
                onChange={(e) => setSpecialDriverName(e.target.value)}
                className={classes.input}
              />
              <div className={classes.paperFooter}>
                <Button type="submit" variant="contained" color="primary">
                  Dodaj odbiorc??
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
            Zamierzasz usun???? zlecenie o ID {idToRemove}
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
            Usu??
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
