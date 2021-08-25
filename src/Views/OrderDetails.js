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
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress,
  DialogActions,
} from '@material-ui/core';
import fireDB, { storage } from '../Firebase';
import MainWrapper from '../Components/MainWrapper/MainWrapper';
import moment from 'moment';
import { Alert, Autocomplete } from '@material-ui/lab';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { AttachFile, Clear } from '@material-ui/icons';
import { DataContext } from '../Data';

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
  separator: {
    height: 1,
    backgroundColor: theme.palette.grey[400],
  },
  rowSeparatedDisplay: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  alignRight: {
    textAlign: 'right',
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
  const [assignEmployee, setAssignEmployee] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [customer, setCustomer] = useState('');
  const [signature, setSignature] = useState('');
  const [changeSignature, setChangeSignature] = useState(false);
  const [fileUploadModal, setFileUploadModal] = useState(false);
  const [file, setFile] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  const { usersList, customersList, customers, specialDrivers } =
    useContext(DataContext);

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
      console.log(singleOrderDetails);
      setSignature(singleOrderDetails.signature);
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

  const openFileUploadModal = () => setFileUploadModal(true);

  const closeFileUploadModal = () => {
    setFileUploadModal(false);
    setFile('');
    setUploadProgress(0);
  };

  const uploadFile = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      // generateFileName(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`files/${file.name}`).put(file);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setUploadProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref('files')
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            setAttachmentLink(url);
            closeFileUploadModal();
          });
      }
    );
  };

  const setAttachmentLink = (attachmentLink) => {
    const Ref = fireDB.database().ref('Orders').child(orderDetail.order);
    Ref.update({
      attachmentLink,
    });
  };

  if (!usersList && !customersList && !customers && !specialDrivers)
    return null;

  return (
    <div>
      <MainWrapper>
        {orderDetail && (
          <Paper className={classes.paper}>
            <div className={classes.rowSeparatedDisplay}>
              <Typography variant="h4" color="textSecondary">
                Zlecenie #{orderDetail.id}
              </Typography>
              <div className={classes.alignRight}>
                <Typography className={classes.label} variant="body1">
                  Załącznik
                </Typography>
                <IconButton
                  component="a"
                  href={orderDetail.attachmentLink}
                  size="small"
                  target="_blank"
                  rel="noreferrer noopener"
                  disabled={!orderDetail.attachmentLink}
                >
                  <AttachFile
                    color={
                      !!orderDetail.attachmentLink ? 'secondary' : 'disabled'
                    }
                  />
                </IconButton>
                {!orderDetail.attachmentLink && (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={openFileUploadModal}
                  >
                    Dodaj
                  </Button>
                )}
              </div>
            </div>
            <Typography className={classes.label} variant="body1">
              Zleceniodawca
            </Typography>
            <Typography gutterBottom variant="body2" component="div">
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
            <div className={classes.inlineDisplay}>
              {changeSignature ? (
                <TextField
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                />
              ) : (
                <Typography gutterBottom variant="body2">
                  {orderDetail.signature}
                </Typography>
              )}
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={() => setChangeSignature(!changeSignature)}
              >
                {changeSignature ? 'Anuluj' : 'Zmień'}
              </Button>
            </div>
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
                  value={pickupDate}
                  onChange={(date) => setPickupDate(moment(date).format())}
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
                specialDrivers[assignEmployee] ||
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
          <div className={classes.separator} />
          {specialDrivers &&
            Object.entries(specialDrivers).map(([id, name]) => (
              <MenuItem key={id} onClick={() => assignEmployeeHandler(id)}>
                {name}
              </MenuItem>
            ))}
          <div className={classes.separator} />
          {Object.entries(usersList).map(([uId, name]) => (
            <MenuItem key={uId} onClick={() => assignEmployeeHandler(uId)}>
              {name}
            </MenuItem>
          ))}
        </Menu>
      </MainWrapper>
      <Dialog
        open={fileUploadModal}
        disableBackdropClick
        PaperProps={{
          style: {
            minWidth: 550,
          },
        }}
      >
        <DialogTitle>Dodaj załącznik</DialogTitle>
        <DialogContent>
          <Button
            variant="contained"
            component="label"
            color="primary"
            fullWidth
          >
            Wybierz plik
            <input type="file" hidden onChange={uploadFile} key={file.name} />
          </Button>
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            style={{ margin: '10px auto' }}
          />
          {file && (
            <Typography variant="body2" className={classes.margin1}>
              Wybrany plik: {file.name}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            disabled={uploadProgress > 0 && uploadProgress < 100}
            onClick={closeFileUploadModal}
          >
            {uploadProgress > 0 || uploadProgress === 100
              ? 'Zamknij'
              : 'Anuluj'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={
              uploadProgress > 0 || (orderDetail && orderDetail.attachmentLink)
            }
          >
            Dodaj załącznik
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderDetails;
