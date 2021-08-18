import {
  Button,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  TextField,
  MenuItem,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import moment from 'moment';
import fireDB from '../Firebase';
import Statuses from './MainWrapper/Statuses';
import NewOrderModalBody from './NewOrderModalBody';
import { AttachFile, Clear, Info } from '@material-ui/icons';
import { DataContext } from '../Data';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import 'moment/locale/pl';

const useStyles = makeStyles((theme) => ({
  controlsWrapper: {
    display: 'flex',
    margin: theme.spacing(3),
  },
  table: {
    overflowX: 'auto',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
  },
  filtersWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(2),
    '& > *': {
      marginRight: theme.spacing(2),
      minWidth: 200,
    },
  },
}));

const OrdersTable = ({ tab, disableFilter }) => {
  const classes = useStyles();
  const [iterator, setIterator] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [customerFilter, setCustomerFilter] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');

  const { orders, customersList, specialDrivers, usersList } =
    useContext(DataContext);

  useEffect(() => {
    const configRef = fireDB.database().ref('Config').child('Iterator');
    configRef.on('value', (snapshot) => {
      const iteratorVal = snapshot.val();
      setIterator(iteratorVal);
    });
  }, []);

  const filterTableRecords = () =>
    orders.filter(
      (item) =>
        item.type === tab &&
        (customerFilter ? item.customer === parseInt(customerFilter) : true) &&
        (filterDateFrom
          ? moment(item.createDate).format('YYYYMMDD') >=
            moment(filterDateFrom).format('YYYYMMDD')
          : true) &&
        (filterDateTo
          ? moment(item.createDate).format('YYYYMMDD') <=
            moment(filterDateTo).format('YYYYMMDD')
          : true)
    );

  const updateIterator = () => {
    const configRef = fireDB.database().ref('Config');
    configRef.update({ Iterator: iterator + 1 });
  };

  const clrDateFrom = (e) => {
    e.stopPropagation();
    setFilterDateFrom(null);
  };

  const clrDateTo = (e) => {
    e.stopPropagation();
    setFilterDateTo(null);
  };

  if (!usersList && !customersList && !orders && !specialDrivers) return null;

  return (
    <>
      <TableContainer
        component={Paper}
        style={{ padding: 16 }}
        className={classes.table}
        square
      >
        <div className={classes.controlsWrapper}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalOpen(true)}
          >
            Nowe zlecenie
          </Button>
          <div className={classes.filtersWrapper}>
            <TextField
              size="small"
              select
              label="Zleceniodawca"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
            >
              <MenuItem value="">BRAK</MenuItem>
              {Object.entries(customersList).map(([id, name]) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
            <MuiPickersUtilsProvider utils={MomentUtils} locale="pl">
              <KeyboardDatePicker
                autoOk
                label="Utworzone od"
                format="DD/MM/YYYY"
                value={filterDateFrom ? moment(filterDateFrom).format() : null}
                onChange={(date) => setFilterDateFrom(moment(date).format())}
                InputProps={{
                  startAdornment: (
                    <IconButton size="small" onClick={(e) => clrDateFrom(e)}>
                      <Clear />
                    </IconButton>
                  ),
                }}
              />
              <KeyboardDatePicker
                autoOk
                label="Utworzone do"
                format="DD/MM/YYYY"
                value={filterDateTo ? moment(filterDateTo).format() : null}
                onChange={(date) => setFilterDateTo(moment(date).format())}
                InputProps={{
                  startAdornment: (
                    <IconButton size="small" onClick={(e) => clrDateTo(e)}>
                      <Clear />
                    </IconButton>
                  ),
                }}
              />
            </MuiPickersUtilsProvider>
          </div>
        </div>
        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ZLECENIODAWCA</TableCell>
              <TableCell>SYGNATURA SPRAWY</TableCell>
              <TableCell>DATA UTWORZENIA</TableCell>
              <TableCell>DATA ODBIORU</TableCell>
              <TableCell>ODBIORCA</TableCell>
              <TableCell>OS. ODP.</TableCell>
              <TableCell>STATUS ZLECENIA</TableCell>
              <TableCell padding="none" />
            </TableRow>
          </TableHead>
          <TableBody>
            {!orders ? (
              <TableRow>
                <TableCell align="center" colSpan="20">
                  Ładowanie...
                </TableCell>
              </TableRow>
            ) : (
              ((disableFilter && orders) || filterTableRecords()).map(
                ({
                  id,
                  docId,
                  customer,
                  signature,
                  createDate,
                  pickupDate,
                  employee,
                  employeeDriver,
                  status,
                  attachmentLink,
                }) => (
                  <TableRow key={id}>
                    <TableCell style={{ fontSize: 12 }}>{id}</TableCell>
                    <TableCell style={{ fontSize: 12 }}>
                      {customersList[customer]}
                    </TableCell>
                    <TableCell style={{ fontSize: 12 }}>{signature}</TableCell>
                    <TableCell style={{ fontSize: 12 }}>
                      {createDate && moment(createDate).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell style={{ fontSize: 12 }}>
                      {pickupDate
                        ? moment(pickupDate).format('DD/MM/YYYY')
                        : ''}
                    </TableCell>
                    <TableCell style={{ fontSize: 12 }}>
                      {usersList[employeeDriver] ||
                        specialDrivers[employeeDriver]}
                    </TableCell>
                    <TableCell>{usersList[employee]}</TableCell>
                    <TableCell>
                      <Statuses status={status} docId={docId} />
                    </TableCell>
                    <TableCell align="right" padding="checkbox">
                      <div className={classes.actions}>
                        <IconButton
                          component="a"
                          href={attachmentLink}
                          size="small"
                          target="_blank"
                          rel="noreferrer noopener"
                          disabled={!attachmentLink}
                        >
                          <AttachFile
                            fontSize="small"
                            color={!!attachmentLink ? 'secondary' : 'disabled'}
                          />
                        </IconButton>
                        <IconButton
                          component={Link}
                          to={`/zlecenie/${id}`}
                          size="small"
                        >
                          <Info color="primary" />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        disableBackdropClick
      >
        <>
          <NewOrderModalBody
            iterator={iterator}
            setModalOpen={setModalOpen}
            updateIterator={updateIterator}
            tab={tab}
          />
        </>
      </Modal>
    </>
  );
};

export default OrdersTable;
