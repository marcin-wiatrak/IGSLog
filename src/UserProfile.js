import MainWrapper from './Components/MainWrapper/MainWrapper';
import {
  Button,
  Typography,
  Modal,
  Paper,
  makeStyles,
} from '@material-ui/core';
import { useContext, useState } from 'react';
import { AuthContext } from './Auth';
import fireDB from './Firebase';

const useStyles = makeStyles((theme) => ({
  paper: {
    width: '500px',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    padding: theme.spacing(3),
  },
}));

const UserProfile = () => {
  const classes = useStyles();
  const { currentUserProfile } = useContext(AuthContext);
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [snackbar, setSnackbar] = useState();

  const handleResetPassword = async () => {
    try {
      await fireDB.auth().sendPasswordResetEmail(currentUserProfile.email);
      setSnackbar(true);
      setConfirmationModalOpen(false);
    } catch (error) {
      console.log('error', error);
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
          <Button
            color="primary"
            variant="contained"
            onClick={handleResetPassword}
          >
            POTWIERDŹ
          </Button>
          <Button onClick={() => setConfirmationModalOpen(false)}>
            ANULUJ
          </Button>
        </Paper>
      </Modal>
    </>
  );
};

export default UserProfile;
