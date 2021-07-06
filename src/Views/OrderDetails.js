import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router';
import {
  makeStyles,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Snackbar,
} from '@material-ui/core';
import fireDB from '../Firebase';
import MainWrapper from '../Components/MainWrapper/MainWrapper';
import moment from 'moment';
import { AuthContext } from '../Auth';
import { Alert } from '@material-ui/lab';

const useStyles = makeStyles((theme) => ({
  label: {
    textTransform: 'uppercase',
    color: theme.palette.grey[600],
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
}));

const OrderDetails = () => {
  const { orderId } = useParams();
  const classes = useStyles();
  const [orderDetail, setOrderDetail] = useState();
  const [notes, setNotes] = useState();
  const [saveNotes, setSaveNotes] = useState(false);

  const { usersList } = useContext(AuthContext);

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
    });
  }, []);

  const updateEditableFields = () => {
    const configRef = fireDB.database().ref('Orders').child(orderDetail.order);
    configRef.update({ notes });
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
              {orderDetail.customer}
            </Typography>
            <Typography className={classes.label} variant="body1">
              Sygnatura sprawy
            </Typography>
            <Typography gutterBottom variant="body2">
              {orderDetail.signature}
            </Typography>
            <Typography className={classes.label} variant="body1">
              Data utworzenia
            </Typography>
            <Typography gutterBottom variant="body2">
              {moment(orderDetail.createDate).format('DD-MM-YYYY')}
            </Typography>
            <Typography className={classes.label} variant="body1">
              Data odbioru
            </Typography>
            <Typography gutterBottom variant="body2">
              {moment(orderDetail.pickupDate).format('DD-MM-YYYY')}
            </Typography>
            <Typography className={classes.label} variant="body1">
              Odbiorca
            </Typography>
            <Typography gutterBottom variant="body2">
              {usersList[orderDetail.employee]}
            </Typography>
            <TextField
              label="dodatkowe informacje"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <div className={classes.actionFooter}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  updateEditableFields();
                  setSaveNotes(true);
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
      </MainWrapper>
    </div>
  );
};

export default OrderDetails;
