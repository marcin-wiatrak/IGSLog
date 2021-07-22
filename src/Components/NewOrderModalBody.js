import MomentUtils from '@date-io/moment';
import {
  Button,
  FormGroup,
  TextField,
  Paper,
  makeStyles,
  IconButton,
  Typography,
  Modal,
  LinearProgress,
} from '@material-ui/core';
import { AddCircle, CloseRounded } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import moment from 'moment';
import 'moment/locale/pl';
import React, { useContext, useState } from 'react';
import { AuthContext } from '../Auth';
import fireDB, { storage } from '../Firebase';
import NewCustomerModalBody from './NewCustomerModalBody';

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
    // borderBottom: `1px solid ${theme.palette.grey[400]}`,
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
  addCustomerRef: {
    paddingTop: theme.spacing(2),
  },
  inRowDisplay: {
    display: 'grid',
    gridTemplateColumns: '1fr 40px',
    alignItems: 'end',
    marginBottom: theme.spacing(1),
    '& > button': {
      justifySelf: 'center',
      width: 30,
      height: 30,
    },
  },
  margin1: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const NewOrderModalBody = ({ setModalOpen, iterator, updateIterator, tab }) => {
  const [pickupDate, setPickupDate] = useState(null);
  const [createDate, setCreateDate] = useState(moment().format());
  const [localization, setLocalization] = useState('');
  const [customer, setCustomer] = useState('');
  const [signature, setSignature] = useState('');
  const [notes, setNotes] = useState('');
  const [customerReset, setCustomerReset] = useState(false);
  const [createCustomerModal, setCreateCustomerModal] = useState(false);
  const [file, setFile] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [attachmentLink, setAttachmentLink] = useState('');
  const [fileName, setFileName] = useState('');

  const { currentUser, customers } = useContext(AuthContext);

  const classes = useStyles();

  const resetForm = () => {
    setPickupDate(new Date());
    setLocalization('');
    setCustomerReset(!customerReset);
    setSignature('');
    setNotes('');
  };

  const uploadFile = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      generateFileName(e.target.files[0]);
    }
  };

  const generateFileName = (fileItem) => {
    const fileData = fileItem || file;
    const [fileExtension] = fileData.name.split('.').slice(-1);
    const fileNameString = `zalacznik_${moment(createDate).format(
      'YYYYMMDD_HHmmss'
    )}_${signature.replaceAll(' ', '_').toLowerCase()}.${fileExtension}`;
    setFileName(fileNameString);
  };

  const fileUploadClear = () => {
    setFile('');
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
          });
      }
    );
  };

  const createTaskHandler = async () => {
    const task = {
      id: iterator,
      customer,
      createDate: '' + moment().format(),
      pickupDate: pickupDate ? pickupDate : null,
      employee: currentUser.uid,
      localization,
      status: 'NEW_TASK',
      notes,
      signature,
      type: tab,
      attachmentLink,
    };
    const pushTaskRef = fireDB.database().ref('Orders');
    pushTaskRef.push(task);
    setModalOpen(false);
    updateIterator();
  };

  const formValidation = customer === '' || signature === '';

  return (
    <>
      <Paper className={classes.modalWrapper} square>
        <IconButton
          onClick={() => setModalOpen(false)}
          size="small"
          className={classes.closeButton}
        >
          <CloseRounded style={{ width: 30, height: 30 }} />
        </IconButton>
        <div className={classes.modalHeader}>
          <Typography variant="h4" color="primary">
            Nowe zlecenie
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {`#${iterator}`}
          </Typography>
        </div>
        <div className={classes.modalContent}>
          <div className={classes.inRowDisplay}>
            <Autocomplete
              options={customers}
              key={customerReset}
              getOptionLabel={(option) => option.companyName}
              onChange={(e, newValue) =>
                setCustomer(newValue && newValue.customerId)
              }
              openOnFocus
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Zleceniodawca *"
                  value={customer}
                />
              )}
            />
            <IconButton
              color="primary"
              size="small"
              onClick={() => {
                setCreateCustomerModal(true);
              }}
            >
              <AddCircle />
            </IconButton>
          </div>
          <FormGroup>
            <MuiPickersUtilsProvider utils={MomentUtils} locale="pl">
              <KeyboardDatePicker
                format="DD MMM YYYY"
                label="Data utworzenia"
                value={createDate}
                onChange={(date) => setCreateDate(moment(date).format())}
                minDate={moment()}
                KeyboardButtonProps={{
                  'aria-label': 'Zmień datę',
                }}
                disabled
              />
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
          </FormGroup>
          <TextField
            label="Miejsce docelowe"
            fullWidth
            margin="normal"
            value={localization}
            onChange={(e) => setLocalization(e.target.value)}
          />
          <TextField
            label="Sygnatura sprawy *"
            value={signature}
            fullWidth
            margin="normal"
            onChange={(e) => setSignature(e.target.value)}
            disabled={fileName}
          />
          <TextField
            label="Notatki"
            fullWidth
            multiline
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div>
          <Typography variant="subtitle1" color="textSecondary">
            Dodaj załącznik
          </Typography>
          <Button
            variant="contained"
            component="label"
            color="primary"
            fullWidth
            disabled={!signature}
          >
            Wybierz plik
            <input type="file" hidden onChange={uploadFile} key={file.name} />
          </Button>
          {!signature && (
            <Typography color="error" variant="caption">
              Wprowadź sygnaturę przed dodaniem załącznika
            </Typography>
          )}
          {file && (
            <>
              <Typography variant="body2" className={classes.margin1}>
                Wybrany plik: {file.name}
              </Typography>
              <Typography variant="body2" className={classes.margin1}>
                Nazwa po wgraniu: {fileName}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={uploadProgress}
                className={classes.margin1}
              />
              <div>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                >
                  Wgraj plik
                </Button>
                <Button onClick={fileUploadClear}>Anuluj</Button>
              </div>
            </>
          )}
        </div>
        <div className={classes.modalFooter}>
          <Button variant="contained" onClick={resetForm}>
            Wyczyść formularz
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={createTaskHandler}
            disabled={(!!file.name && uploadProgress !== 100) || formValidation}
          >
            {!!file.name && uploadProgress !== 100
              ? 'Najpierw wyślij plik'
              : 'Dodaj zlecenie'}
          </Button>
        </div>
      </Paper>
      <Modal
        open={createCustomerModal}
        onClose={() => setCreateCustomerModal(false)}
        disableBackdropClick
      >
        <>
          <NewCustomerModalBody
            createCustomerModal={createCustomerModal}
            setCreateCustomerModal={setCreateCustomerModal}
          />
        </>
      </Modal>
    </>
  );
};

export default NewOrderModalBody;
