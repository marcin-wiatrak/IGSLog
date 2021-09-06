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
  ListItemIcon,
  ListItemText,
  Typography,
  TableSortLabel,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import React, { useEffect, useState, useContext } from 'react';
import moment from 'moment';
import fireDB from '../Firebase';
import Statuses from './Statuses';
import NewOrderModalBody from './NewOrderModalBody';
import {
  AllInclusive,
  AssignmentTurnedIn,
  AttachFile,
  Clear,
  FlightLand,
  FlightTakeoff,
  Info,
  NewReleases,
} from '@material-ui/icons';
import { DataContext } from '../Data';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import 'moment/locale/pl';
import * as R from 'ramda';
import { Autocomplete } from '@material-ui/lab';

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
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
    borderColor: theme.palette.grey[300],
    border: '1px solid',
    borderRadius: 10,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '& > *:not(:first-child)': {
      marginRight: theme.spacing(2),
      minWidth: 200,
    },
  },
  filtersLabel: {
    position: 'absolute',
    top: -15,
    left: 15,
    backgroundColor: theme.palette.common.white,
  },
  separator: {
    height: 1,
    backgroundColor: theme.palette.grey[400],
  },
  statusSelect: {
    maxHeight: 48,
    '& .MuiSelect-root': {
      display: 'flex',
      // padding: 0,
      '& > .MuiListItemIcon-root': {
        minWidth: 32,
      },
    },
  },
}));

const OrdersTable = ({ tab, disableFilter }) => {
  const classes = useStyles();
  const [iterator, setIterator] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [customerFilter, setCustomerFilter] = useState('');
  const [driverFilter, setDriverFilter] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [usersFilter, setUsersFilter] = useState('');
  const [sortingType, setSortingType] = useState('id');
  const [sortingDirection, setSortingDirection] = useState('asc');

  const { orders, customersList, specialDrivers, usersList, rawUsersList } =
    useContext(DataContext);

  const labels = [
    ['id', 'ID'],
    ['customerName', 'Zleceniodawca'],
    ['signature', 'Sygnatura'],
    ['createDate', 'Data utworzenia'],
    ['pickupDate', 'Data odbioru'],
    ['employeeDriverName', 'Odbiorca'],
    ['employee', 'Os. odp.'],
    ['status', 'Status'],
  ];

  useEffect(() => {
    const configRef = fireDB.database().ref('Config').child('Iterator');
    configRef.on('value', (snapshot) => {
      const iteratorVal = snapshot.val();
      setIterator(iteratorVal);
    });
  }, []);

  const usersListAC = Object.entries(rawUsersList).map((item) => item[1]);

  const filterTableRecords = () =>
    orders.filter(
      (item) =>
        item.type === tab &&
        (customerFilter ? item.customer === parseInt(customerFilter) : true) &&
        (driverFilter ? item.employeeDriver === driverFilter : true) &&
        (usersFilter ? item.employee === usersFilter : true) &&
        (filterDateFrom
          ? moment(item.createDate).format('YYYYMMDD') >=
            moment(filterDateFrom).format('YYYYMMDD')
          : true) &&
        (filterDateTo
          ? moment(item.createDate).format('YYYYMMDD') <=
            moment(filterDateTo).format('YYYYMMDD')
          : true) &&
        (filterStatus ? item.status === filterStatus : true)
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

  const sortData = (arr) => {
    const preparedArr = arr.reduce((acc, item) => {
      item.customerName = customersList[item.customer];
      item.employeeDriverName =
        usersList[item.employeeDriver] || specialDrivers[item.employeeDriver];
      acc = [...acc, item];
      return acc;
    }, []);
    const sortingFn =
      sortingDirection === 'asc'
        ? R.sortWith([R.ascend(R.prop(sortingType) || '')])
        : R.sortWith([R.descend(R.prop(sortingType) || '')]);
    return sortingFn(preparedArr);
  };

  const handleRequestSort = (property) => {
    const direction = sortingType === property && sortingDirection === 'asc';
    setSortingDirection(direction ? 'desc' : 'asc');
    setSortingType(property);
  };

  const generateSortingTableLabels = () => {
    return labels.map(([type, label]) => (
      <TableCell key={type}>
        <TableSortLabel
          active={sortingType === type}
          direction={sortingType === type ? sortingDirection : 'asc'}
          onClick={() => handleRequestSort(type)}
        >
          {label}
        </TableSortLabel>
      </TableCell>
    ));
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
        </div>
        <div className={classes.filtersWrapper}>
          <Typography
            className={classes.filtersLabel}
            color="textSecondary"
            variant="h6"
          >
            Filtry
          </Typography>
          <Autocomplete
            size="small"
            options={usersListAC}
            // key={customerReset}
            getOptionLabel={(option) => `${option.firstName} ${option.lastName}`}
            onChange={(e, newValue) => setUsersFilter(newValue && newValue.uId)}
            openOnFocus
            renderInput={(params) => (
              <TextField
                {...params}
                label="Os. odpowiedzialna"
                value={usersFilter}
              />
            )}
          />
          <TextField
            size="small"
            select
            label="Zleceniodawca"
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
          >
            <MenuItem value="">BRAK</MenuItem>
            <div className={classes.separator} />
            {Object.entries(customersList).map(([id, name]) => (
              <MenuItem key={id} value={id}>
                {name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            select
            label="Odbiorca"
            value={driverFilter}
            onChange={(e) => setDriverFilter(e.target.value)}
          >
            <MenuItem key="none" value="">
              BRAK
            </MenuItem>
            <div className={classes.separator} />
            {specialDrivers &&
              Object.entries(specialDrivers).map(([id, name]) => (
                <MenuItem key={id} value={id}>
                  {name}
                </MenuItem>
              ))}
            <div className={classes.separator} />
            {Object.entries(rawUsersList)
              .filter(([uId, user]) => !user.hidden)
              .map(([uId, user]) => (
                <MenuItem key={uId} value={uId}>
                  {`${user.firstName} ${user.lastName}`}
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
          <TextField
            size="small"
            label="Status"
            select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={classes.statusSelect}
          >
            <MenuItem value="">
              <ListItemIcon>
                <AllInclusive color="primary" />
              </ListItemIcon>
              <ListItemText primary="Wszystkie" />
            </MenuItem>
            <MenuItem value="NEW_TASK">
              <ListItemIcon>
                <NewReleases />
              </ListItemIcon>
              <ListItemText primary="Zarejestrowane" />
            </MenuItem>
            <MenuItem value="PICKED_UP">
              <ListItemIcon>
                <FlightTakeoff style={{ color: '#03a1fc' }} />
              </ListItemIcon>
              <ListItemText primary="Odebrane" />
            </MenuItem>
            <MenuItem value="DELIVERED">
              <ListItemIcon>
                <FlightLand style={{ color: '#f385ff' }} />
              </ListItemIcon>
              <ListItemText primary="Dostarczone" />
            </MenuItem>
            <MenuItem value="CLOSED">
              <ListItemIcon>
                <AssignmentTurnedIn style={{ color: '#00ba06' }} />
              </ListItemIcon>
              <ListItemText primary="Przekazane na dział" />
            </MenuItem>
          </TextField>
        </div>
        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              {generateSortingTableLabels()}
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
              (disableFilter && orders) ||
              sortData(filterTableRecords()).map(
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
