import {
  Button,
  TextField,
  Paper,
  makeStyles,
  IconButton,
  Typography,
} from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';
import 'moment/locale/pl';
import React, { useEffect, useState } from 'react';
import fireDB from '../Firebase';

const useStyles = makeStyles((theme) => ({
  modalWrapper: {
    maxHeight: '90%',
    maxWidth: '90%',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    padding: theme.spacing(4),
    overflowY: 'auto',

  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
  },
  modalHeader: {
    borderBottom: `1px solid ${theme.palette.grey[400]}`,
    paddingBottom: theme.spacing(2),
  },
  modalContent: {
    padding: `${theme.spacing(2)}px 0px`,
  },
  modalFooter: {
    paddingTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'space-around',
  },
}));

const NewCustomerModalBody = ({ setCreateCustomerModal }) => {
  const [address, setAddress] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerReset, setCustomerReset] = useState(false);
  const [customers, setCustomers] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    const customers = fireDB.database().ref('Customers');
    customers.on('value', (snapshot) => {
      const customers = snapshot.val();
      const customersList = [];
      for (let item in customers) {
        customersList.push(customers[item].customerName);
      }
      setCustomers(customersList);
    });
  }, []);

  const resetForm = () => {
    setAddress('');
    setCompanyName('');
    setCustomerReset(!customerReset);
    setCustomerName('');
    setPhoneNumber('');
  };

  const createCustomerHandler = () => {
    const customer = {
      address,
      companyName,
      customerName,
      phoneNumber,
    };

    const pushCustomerRef = fireDB.database().ref('Customers');
    pushCustomerRef.push(customer);
    setCreateCustomerModal(false);
  };

  return (
    <Paper className={classes.modalWrapper} square>
      <IconButton
        onClick={() => setCreateCustomerModal(false)}
        size="small"
        className={classes.closeButton}
      >
        <CloseRounded style={{ width: 30, height: 30 }} />
      </IconButton>
      <div className={classes.modalHeader}>
        <Typography variant="h4" color="primary">
          Nowy zleceniodawca
        </Typography>
      </div>
      <div className={classes.modalContent}>
        <TextField
          label="Adres zleceniodawcy *"
          fullWidth
          margin="normal"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          label="Nazwa firmy *"
          value={companyName}
          fullWidth
          margin="normal"
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <TextField
          label="Zleceniodawca"
          value={customerName}
          fullWidth
          margin="normal"
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <TextField
          label="Numer telefonu"
          value={phoneNumber}
          fullWidth
          margin="normal"
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div className={classes.modalFooter}>
        <Button variant="contained" onClick={resetForm}>
          Wyczyść formularz
        </Button>
        <Button
          color="primary"
          variant="contained"
          onClick={createCustomerHandler}
          disabled={!address || !companyName}
        >
          Dodaj zleceniodawcę
        </Button>
      </div>
    </Paper>
  );
};

export default NewCustomerModalBody;
