import React, { useEffect, useState, useContext } from 'react';
import { useParams, useHistory } from 'react-router';
import {
  makeStyles,
  Paper,
  Typography,
  TextField,
  Button,
  Snackbar,
  Menu,
  MenuItem,
  FormGroup,
  IconButton,
} from '@material-ui/core';
import fireDB from '../Firebase';
import MainWrapper from '../Components/MainWrapper/MainWrapper';
import moment from 'moment';
import { AuthContext } from '../Auth';
import { Alert, Autocomplete } from '@material-ui/lab';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { Clear } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  label: {
    textTransform: 'uppercase',
    color: theme.palette.grey[600],

    '&:not(:first-child)': {
      marginTop: theme.spacing(2),
    },
  },
  paper: {
    padding: theme.spacing(3),
  },
  actionFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: `1px solid ${theme.palette.grey[400]}`,
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
  },
  inlineDisplay: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
}));

const OrderDetails = () => {
  const { orderId } = useParams();
  const history = useHistory();
  const classes = useStyles();
  const [orderDetail, setOrderDetail] = useState();
  const [notes, setNotes] = useState();
  const [saveNotes, setSaveNotes] = useState(false);
  const [assignEmployeeMenu, setAssignEmployeeMenu] = useState(null);
  const [assignEmployee, setAssignEmployee] = useState(null);
  const [pickupDate, setPickupDate] = useState(null);
  const [customer, setCustomer] = useState('');
  const [signature, setSignature] = useState('');
  const [changeSignature, setChangeSignature] = useState(false);

  const { usersList, customersList, customers } = useContext(AuthContext);

  const closeEmployeeMenu = () => setAssignEmployeeMenu(null);

  const openEmployeeMenu = (e) => setAssignEmployeeMenu(e.currentTarget);

  useEffect(() => {
    const orderDetailsRef = fireDB.database().ref('Orders');
    orderDetailsRef.on('value', (snapshot) => {
      const orderDetailsData = snapshot.val();
      let orderDetailsArray = [];
      for (let order in orderDetailsData) {
        orderDetailsArray.push({ order, ...orderDetailsData[order] });
      }
      const singleOrderDetails = orderDetailsArray.find(
        (order) => order.id === parseInt(orderId)
      );
      setOrderDetail(singleOrderDetails);
      setNotes(singleOrderDetails.notes);
      setPickupDate(singleOrderDetails.pickupDate || null);
      setAssignEmployee(singleOrderDetails.employeeDriver || null);
    });
  }, []);

  const updateOrder = () => {
    const configRef = fireDB.database().ref('Orders').child(orderDetail.order);
    configRef.update({
      notes,
      pickupDate,
      employeeDriver: assignEmployee || null,
      customer: customer || orderDetail.customer,
      signature: changeSignature ? signature : orderDetail.signature,
    });
  };

  const assignEmployeeHandler = (uId) => {
    setAssignEmployee(uId);
    closeEmployeeMenu();
  };

  const changeSignatureHandler = () => {
    setChangeSignature(!changeSignature);
  };

  return (
    <div>
      <MainWrapper>
        {orderDetail && (
          <Paper className={classes.paper}>
            <Typography className={classes.label} variant="body1">
              Zleceniodawca
            </Typography>
            <Typography gutterBottom variant="body2">
              {customersList[orderDetail.customer]}
              <Autocomplete
                options={customers}
                getOptionLabel={(option) => option.companyName}
                onChange={(e, newValue) =>
                  setCustomer(newValue && newValue.customerId)
                }
                openOnFocus
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Zleceniodawca"
                    value={customer}
                    style={{ maxWidth: 300 }}
                  />
                )}
              />
            </Typography>
            <Typography className={classes.label} variant="body1">
              Sygnatura sprawy
            </Typography>
            <Typography gutterBottom variant="body2">
              {orderDetail.signature}
              {changeSignature && (
                <TextField
                  value={signature}
                  onChange={e => setSignature(e.target.value)}
                  label="Nowa sygnatura"
                />
              )}
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={() => setChangeSignature(!changeSignature)}
              >
                {changeSignature ? 'Anuluj' : 'Zmień'}
              </Button>
            </Typography>
            <Typography className={classes.label} variant="body1">
              Data utworzenia
            </Typography>
            <Typography gutterBottom variant="body2">
              {moment(orderDetail.createDate).format('DD MMM YYYY')}
            </Typography>
            <Typography className={classes.label} variant="body1">
              Data odbioru
            </Typography>
            <FormGroup className={classes.inlineDisplay}>
              <MuiPickersUtilsProvider utils={MomentUtils} locale="pl">
                <KeyboardDatePicker
                  format="DD MMM YYYY"
                  label="Data odbioru"
                  value={pickupDate}
                  onChange={(date) => setPickupDate(moment(date).format())}
                  minDate={moment()}
                  KeyboardButtonProps={{
                    'aria-label': 'Zmień datę',
                  }}
                />
              </MuiPickersUtilsProvider>
              <IconButton size="small" onClick={() => setPickupDate(null)}>
                <Clear />
              </IconButton>
            </FormGroup>
            <Typography className={classes.label} variant="body1">
              Odbiorca
            </Typography>
            <Typography gutterBottom variant="body2">
              {(assignEmployee === null && 'brak') ||
                usersList[assignEmployee] ||
                orderDetail.employeeDriver}
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={openEmployeeMenu}
              >
                {orderDetail.employeeDriver || assignEmployee
                  ? 'Zmień'
                  : 'Przypisz'}
              </Button>
            </Typography>
            <Typography className={classes.label} variant="body1">
              Osoba odpowiedzialna
            </Typography>
            <Typography gutterBottom variant="body2">
              {usersList[orderDetail.employee]}
            </Typography>
            <TextField
              label="dodatkowe informacje"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ marginTop: 25 }}
            />
            <div className={classes.actionFooter}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  updateOrder();
                  setSaveNotes(true);
                  history.goBack();
                }}
              >
                Zapisz
              </Button>
            </div>
          </Paper>
        )}
        <Snackbar
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={saveNotes}
          onClose={() => setSaveNotes(false)}
          autoHideDuration={6000}
        >
          {saveNotes === true ? (
            <Alert severity="success">Zmiany zostały pomyślnie zapisane!</Alert>
          ) : null}
        </Snackbar>
        <Menu
          id="simple-menu"
          anchorEl={assignEmployeeMenu}
          keepMounted
          open={!!assignEmployeeMenu}
          onClose={closeEmployeeMenu}
        >
          <MenuItem key="none" onClick={() => assignEmployeeHandler(null)}>
            USUŃ PRZYPISANIE
          </MenuItem>
          {Object.entries(usersList).map(([uId, name]) => (
            <MenuItem key={uId} onClick={() => assignEmployeeHandler(uId)}>
              {name}
            </MenuItem>
          ))}
        </Menu>
      </MainWrapper>
    </div>
  );
};

export default OrderDetails;
