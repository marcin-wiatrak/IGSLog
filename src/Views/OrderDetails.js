import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { makeStyles, Paper, Typography, TextField } from '@material-ui/core';
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
  button: {},
}));

const OrderDetails = (props) => {
  const { taskId } = useParams();
  const classes = useStyles();
  const [taskDetail, setTaskDetail] = useState();

  useEffect(() => {
    const taskDetailsRef = fireDB.database().ref('Orders');
    taskDetailsRef.on('value', (snapshot) => {
      const taskDetailsData = snapshot.val();
      let taskDetailsArray = [];
      for (let task in taskDetailsData) {
        taskDetailsArray.push({ task, ...taskDetailsData[task] });
      }
      console.log(taskDetailsArray);
      const singleTaskDetails = taskDetailsArray.find(
        (task) => task.id === parseInt(taskId)
      );
      setTaskDetail(singleTaskDetails);
    });
  }, []);

  return (
    <div>
      <MainWrapper>
        {taskDetail && (
          <Paper className={classes.paper}>
            <Typography className={classes.label} variant="body1">
              Zleceniodawca
            </Typography>
            <Typography gutterBottom variant="body2">
              {taskDetail.customer}
            </Typography>
            <Typography className={classes.label} variant="body1">
              Sygnatura sprawy
            </Typography>
            <Typography gutterBottom variant="body2">
              {taskDetail.signature}
            </Typography>
            <Typography className={classes.label} variant="body1">
              Data utworzenia
            </Typography>
            <Typography gutterBottom variant="body2">
              {moment(taskDetail.createDate).format('DD-MM-YYYY')}
            </Typography>
            <Typography className={classes.label} variant="body1">
              Data odbioru
            </Typography>
            <Typography gutterBottom variant="body2">
              {moment(taskDetail.pickupDate).format('DD-MM-YYYY')}
            </Typography>
            <Typography className={classes.label} variant="body1">
              Odbiorca
            </Typography>
            <Typography gutterBottom variant="body2">
              {taskDetail.employee}
            </Typography>
            <TextField
              label="dodatkowe informacje"
              value={taskDetail.notes}
              onChange={() => {
                console.log('działa');
              }}
            />
          </Paper>
        )}
      </MainWrapper>
    </div>
  );
};

export default OrderDetails;
