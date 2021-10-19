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
import { DatePicker } from '@material-ui/pickers';
import { AttachFile } from '@material-ui/icons';
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
    maxWidth: 500,
    margin: '0 auto',
  },
  actionFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    borderTop: `1px solid ${theme.palette.grey[400]}`,
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    '& > button': {
      margin: '0 8px',
    },
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
  const [localization, setLocalization] = useState();
  const [saveNotes, setSaveNotes] = useState(false);
  const [assignEmployeeMenu, setAssignEmployeeMenu] = useState(null);
  const [assignEmployee, setAssignEmployee] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [customer, setCustomer] = useState('');
  const [signature, setSignature] = useState('');
  const [changeSignature, setChangeSignature] = useState(false);
  const [changeCustomer, setChangeCustomer] = useState(false);
  const [changeLocalization, setChangeLocalization] = useState(false);
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
      setSignature(singleOrderDetails.signature);
      setOrderDetail(singleOrderDetails);
      setNotes(singleOrderDetails.notes);
      setPickupDate(singleOrderDetails.pickupDate || null);
      setAssignEmployee(singleOrderDetails.employeeDriver || null);
      setCustomer(singleOrderDetails.customer);
      setLocalization(singleOrderDetails.localization);
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
      localization: localization || orderDetail.localization,
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

  console.log(customer);

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
                {!orderDetail.attachmentLink ? (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={openFileUploadModal}
                  >
                    Dodaj
                  </Button>
                ) : (
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setAttachmentLink('')}
                  >
                    Usuń
                  </Button>
                )}
              </div>
            </div>
            <Typography className={classes.label} variant="body1">
              Osoba odpowiedzialna
            </Typography>
            <Typography gutterBottom variant="body2">
              {usersList[orderDetail.employee]}
            </Typography>
            <Typography className={classes.label} variant="body1">
              Data utworzenia
            </Typography>
            <Typography gutterBottom variant="body2">
              {moment(orderDetail.createDate).format('DD MMM YYYY')}
            </Typography>
            <Typography className={classes.label} variant="body1">
              Zleceniodawca
            </Typography>
            <div className={classes.inlineDisplay}>
              {changeCustomer ? (
                <Autocomplete
                  options={customers}
                  getOptionLabel={(option) => option.companyName}
                  onChange={(e, newValue) =>
                    setCustomer(newValue && newValue.customerId)
                  }
                  fullWidth
                  openOnFocus
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      size="small"
                      value={customer}
                    />
                  )}
                />
              ) : (
                <Typography gutterBottom variant="body2">
                  {customersList[orderDetail.customer]}
                </Typography>
              )}
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={() => setChangeCustomer(!changeCustomer)}
              >
                {changeCustomer ? 'Anuluj' : 'Zmień'}
              </Button>
            </div>
            <Typography className={classes.label} variant="body1">
              Sygnatura sprawy
            </Typography>
            <div className={classes.inlineDisplay}>
              {changeSignature ? (
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
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
              Data odbioru
            </Typography>
            <FormGroup className={classes.inlineDisplay}>
              <DatePicker
                format="DD MMM YYYY"
                value={pickupDate}
                onChange={(date) => setPickupDate(moment(date).format())}
                inputVariant="outlined"
                size="small"
                fullWidth
              />
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
              Lokalizacja
            </Typography>
            <div className={classes.inlineDisplay}>
              {changeLocalization ? (
                <TextField
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={localization}
                  onChange={(e) => setLocalization(e.target.value)}
                />
              ) : (
                <Typography gutterBottom variant="body2">
                  {orderDetail.localization}
                </Typography>
              )}
              <Button
                variant="text"
                color="primary"
                size="small"
                onClick={() => setChangeLocalization(!changeLocalization)}
              >
                {changeLocalization ? 'Anuluj' : 'Zmień'}
              </Button>
            </div>
            <Typography className={classes.label} variant="body1">
              Dodatkowe informacje / notatki
            </Typography>
            <TextField
              variant="outlined"
              size="small"
              multiline
              fullWidth
              rows="5"
              rowsMax="5"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className={classes.actionFooter}>
              <Button
                color="primary"
                onClick={() => {
                  history.goBack();
                }}
              >
                Powrót
              </Button>
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
