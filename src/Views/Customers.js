import {
  Button,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  TextField,
  Snackbar,
} from '@material-ui/core';
import { useContext, useState } from 'react';
import MainWrapper from '../Components/MainWrapper/MainWrapper';
import NewCustomerModalBody from '../Components/NewCustomerModalBody';
import { AuthContext } from '../Auth';
import { MoreHoriz } from '@material-ui/icons';
import fireDB from '../Firebase';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  controlsWrapper: {
    display: 'flex',
    margin: theme.spacing(3),
  },
  paper: {
    maxHeight: '90vh',
    overflowY: 'auto',
    width: 400,
    padding: theme.spacing(3),
  },
  modalWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
  textfieldModal: {
    marginBottom: theme.spacing(2),
  },
  actionFooter: {
    marginTop: theme.spacing(2),
    '& > *': {
      marginRight: theme.spacing(2),
    },
  },
}));

const Customers = () => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState(null);
  const [customerActionMenuOpen, setCustomerActionMenuOpen] = useState(false);
  const [customerEditModalOpen, setCustomerEditModalOpen] = useState(false);
  const [customer, setCustomer] = useState();
  const [customerId, setCustomerId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const { customers } = useContext(AuthContext);

  const openMenuHandler = (event, customer) => {
    setCustomerActionMenuOpen(event.currentTarget);
    setCustomer(customer);
    setCustomerId(customer.customerId);
    setCompanyName(customer.companyName);
    setAddress(customer.address);
    setCustomerName(customer.customerName);
    setPhoneNumber(customer.phoneNumber);
  };

  const editCustomerModalOpenHandler = () => {
    setCustomerEditModalOpen(true);
    setCustomerActionMenuOpen(false);
  };

  const editCustomerModalCloseHandler = () => setCustomerEditModalOpen(false);

  const updateCustomer = () => {
    const ref = fireDB.database().ref('Customers').child(customer.docId);
    ref.update({
      customerId,
      companyName,
      address,
      customerName,
      phoneNumber,
    });
    editCustomerModalCloseHandler();
    setSnackbar('CUSTOMER_SAVED');
  };

  const snackbarContent = () => {
    if (snackbar === 'CUSTOMER_SAVED') {
      return <Alert severity="success">Zleceniodawca zapisany</Alert>;
    } else if (snackbar === 'PREPARING') {
      return <Alert severity="info">W przygotowaniu</Alert>;
    } else {
      return <Alert severity="info">Domyślny alert</Alert>;
    }
  };

  return (
    <MainWrapper>
      <TableContainer component={Paper} style={{ padding: 16 }} square>
        <div className={classes.controlsWrapper}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalOpen(true)}
          >
            Dodaj zleceniodawcę
          </Button>
        </div>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ZLECENIODAWCA</TableCell>
              <TableCell>ADRES</TableCell>
              <TableCell>OSOBA DO KONTAKTU</TableCell>
              <TableCell>NUMER TELEFONU</TableCell>
              <TableCell padding="none" />
            </TableRow>
          </TableHead>
          <TableBody>
            {!customers ? (
              <TableRow>
                <TableCell align="center" colSpan="20">
                  Ładowanie...
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.customerId}>
                  <TableCell style={{ fontSize: 12 }}>
                    {customer.customerId}
                  </TableCell>
                  <TableCell style={{ fontSize: 12 }}>
                    {customer.companyName}
                  </TableCell>
                  <TableCell style={{ fontSize: 12 }}>
                    {customer.address}
                  </TableCell>
                  <TableCell style={{ fontSize: 12 }}>
                    {customer.customerName}
                  </TableCell>
                  <TableCell style={{ fontSize: 12 }}>
                    {customer.phoneNumber}
                  </TableCell>
                  <TableCell align="right" padding="checkbox">
                    <IconButton onClick={(e) => openMenuHandler(e, customer)}>
                      <MoreHoriz />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          disableBackdropClick
        >
          <div>
            <NewCustomerModalBody setCreateCustomerModal={setModalOpen} />
          </div>
        </Modal>
      </TableContainer>
      <Menu open={!!customerActionMenuOpen} anchorEl={customerActionMenuOpen}>
        <MenuItem onClick={editCustomerModalOpenHandler}>Edytuj</MenuItem>
        <MenuItem
          onClick={() => {
            setSnackbar('PREPARING');
            setCustomerActionMenuOpen(false);
          }}
        >
          Lista zleceń
        </MenuItem>
      </Menu>
      <Modal
        open={customerEditModalOpen}
        onClose={editCustomerModalCloseHandler}
        disableBackdropClick
      >
        <div className={classes.modalWrapper}>
          <Paper className={classes.paper} square>
            <Typography variant="h5" gutterBottom>
              Edytuj zleceniodawcę
            </Typography>
            <TextField
              label="ID"
              disabled
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              fullWidth
              className={classes.textfieldModal}
            />
            <TextField
              label="Zleceniodawca"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              fullWidth
              className={classes.textfieldModal}
            />
            <TextField
              label="Adres"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              className={classes.textfieldModal}
            />
            <TextField
              label="Osoba do kontaktu"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              fullWidth
              className={classes.textfieldModal}
            />
            <TextField
              label="Numer telefonu"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              fullWidth
              className={classes.textfieldModal}
            />
            <div className={classes.actionFooter}>
              <Button
                variant="contained"
                color="primary"
                onClick={updateCustomer}
              >
                Zapisz
              </Button>
              <Button
                variant="text"
                color="primary"
                onClick={editCustomerModalCloseHandler}
              >
                Anuluj
              </Button>
            </div>
          </Paper>
        </div>
      </Modal>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={!!snackbar}
        onClose={() => setSnackbar(null)}
        autoHideDuration={5000}
      >
        <>{snackbarContent()}</>
      </Snackbar>
    </MainWrapper>
  );
};

export default Customers;
