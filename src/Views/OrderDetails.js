import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import {
  makeStyles,
  Paper,
  Typography,
  TextField,
  Button,
} from '@material-ui/core';
import fireDB from '../Firebase';
import MainWrapper from '../Components/MainWrapper/MainWrapper';
import moment from 'moment';

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

const OrderDetails = (props) => {
  const { orderId } = useParams();
  const classes = useStyles();
  const [orderDetail, setOrderDetail] = useState();
  const [notes, setNotes] = useState();

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
              {orderDetail.employee}
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
                  console.log('działa');
                }}
              >
                Zapisz
              </Button>
            </div>
          </Paper>
        )}
      </MainWrapper>
    </div>
  );
};

export default OrderDetails;
