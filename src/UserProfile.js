import MainWrapper from './Components/MainWrapper/MainWrapper';
import {
  Button,
  Typography,
  Modal,
  Paper,
  makeStyles,
  Snackbar, CircularProgress
} from '@material-ui/core';
import { useContext, useState } from 'react';
import { AuthContext } from './Auth';
import fireDB, { storage } from './Firebase';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '500px',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    padding: theme.spacing(3),
  },
  modalFooter: {
    marginTop: theme.spacing(2),
  },
}));

const UserProfile = () => {
  const classes = useStyles();
  const { currentUserProfile } = useContext(AuthContext);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState('');

  const handleResetPassword = async () => {
    try {
      await fireDB.auth().sendPasswordResetEmail(currentUserProfile.email);
      setConfirmationModalOpen(false);
      setSnackbar('OK');
    } catch (error) {
      console.log('error', error);
      setSnackbar('ERROR');
    }
  };

  return (
    <>
      <MainWrapper>
        <Typography>Zmiana hasła</Typography>
        <Button onClick={() => setConfirmationModalOpen(true)}>
          Zmiana hasła
        </Button>
      </MainWrapper>
      <Snackbar
        open={!!snackbar}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={() => setSnackbar('')}
        autoHideDuration={6000}
      >
        {snackbar === 'OK' && (
          <Alert severity="success">
            Mail resetujący hasło został wysłany na Twój adres email!
          </Alert>
        )}
      </Snackbar>
      <Modal
        open={confirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        disableBackdropClick
      >
        <Paper className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            Resetowanie hasła
          </Typography>
          <Typography variant="body1">
            Na Twój adres email: {`${currentUserProfile.email}`} zostanie
            wysłany link resetujący hasło.
          </Typography>
          <div className={classes.modalFooter}>
            <Button
              color="primary"
              variant="contained"
              onClick={handleResetPassword}
            >
              POTWIERDŹ
            </Button>
            <Button
              onClick={() => {
                setConfirmationModalOpen(false);
              }}
            >
              ANULUJ
            </Button>
          </div>
        </Paper>
      </Modal>
    </>
  );
};

export default UserProfile;
