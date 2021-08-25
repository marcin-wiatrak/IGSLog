import { makeStyles, Tooltip } from '@material-ui/core';
import {
  AssignmentTurnedIn,
  NewReleases,
  FlightLand,
  FlightTakeoff,
} from '@material-ui/icons';
import fireDB from '../Firebase';

const useStyles = makeStyles({
  activee: {
    color: 'black',
  },
  statusWrapper: {
    display: 'flex',
    '& > *': {
      width: 27,
      height: 27,
      padding: 2,
      color: '#CCCCCC',
      cursor: 'pointer',
      border: '2px solid transparent',
      transition: 'ease .3s',
      borderRadius: '3px',
    },
    '& > :nth-child(1):hover': {
      borderBottom: 'solid 2px #a1a1a1',
    },
    '& > :nth-child(2):hover': {
      borderBottom: 'solid 2px #03a1fc',
    },
    '& > :nth-child(3):hover': {
      borderBottom: 'solid 2px #f385ff',
    },
    '& > :nth-child(4):hover': {
      borderBottom: 'solid 2px #00ba06',
    },
  },
  newTask: {
    backgroundColor: '#a1a1a1',
    color: '#ffffff',
  },
  pickedUp: {
    backgroundColor: '#03a1fc',
    color: '#ffffff',
  },
  delivered: {
    backgroundColor: '#f385ff',
    color: '#ffffff',
  },
  closed: {
    backgroundColor: '#00ba06',
    color: '#ffffff',
  },
});

const changeStatusHandler = (status, id) => {
  const configRef = fireDB.database().ref('Orders').child(id);
  configRef.update({ status: status });
};

const Statuses = ({ status, docId }) => {
  const classes = useStyles();
  return (
    <div className={classes.statusWrapper}>
      <Tooltip title="ZAREJESTROWANE" arrow>
        <NewReleases
          onClick={() => changeStatusHandler('NEW_TASK', docId)}
          className={`${status === 'NEW_TASK' ? classes.newTask : ''}`}
        />
      </Tooltip>
      <Tooltip title="ODBIÓR USTALONY" arrow>
        <FlightTakeoff
          onClick={() => changeStatusHandler('PICKED_UP', docId)}
          className={`${status === 'PICKED_UP' ? classes.pickedUp : ''}`}
        />
      </Tooltip>
      <Tooltip title="DOSTARCZONE" arrow>
        <FlightLand
          onClick={() => changeStatusHandler('DELIVERED', docId)}
          className={`${status === 'DELIVERED' ? classes.delivered : ''}`}
        />
      </Tooltip>
      <Tooltip title="MATERIAŁ PRZEKAZANY NA DZIAŁ" arrow>
        <AssignmentTurnedIn
          onClick={() => changeStatusHandler('CLOSED', docId)}
          className={`${status === 'CLOSED' ? classes.closed : ''}`}
        />
      </Tooltip>
    </div>
  );
};

export default Statuses;
