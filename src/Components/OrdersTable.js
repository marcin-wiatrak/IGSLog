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
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import moment from 'moment';
import fireDB from '../Firebase';
import Statuses from './MainWrapper/Statuses';
import NewOrderModalBody from './NewOrderModalBody';
import { AuthContext } from '../Auth';
import { AttachFile, Info } from '@material-ui/icons';

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
}));

const OrdersTable = ({ tab, disableFilter }) => {
  const [iterator, setIterator] = useState();
  const [ordersStore, setOrdersStore] = useState();
  const [modalOpen, setModalOpen] = useState(false);

  const { usersList } = useContext(AuthContext);

  const classes = useStyles();

  useEffect(() => {
    const ordersRef = fireDB.database().ref('Orders');
    ordersRef.on('value', (snapshot) => {
      const orders = snapshot.val();
      const ordersList = [];
      for (let id in orders) {
        ordersList.push({ docId: id, ...orders[id] });
      }
      setOrdersStore(ordersList);
    });
  }, []);

  useEffect(() => {
    const configRef = fireDB.database().ref('Config').child('Iterator');
    configRef.on('value', (snapshot) => {
      const iteratorVal = snapshot.val();
      setIterator(iteratorVal);
    });
  }, []);

  const filterTableRecords = () =>
    ordersStore.filter((item) => item.type === tab);

  const updateIterator = () => {
    const configRef = fireDB.database().ref('Config');
    configRef.update({ Iterator: iterator + 1 });
  };

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
        <Table size="small" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>ZLECENIODAWCA</TableCell>
              <TableCell>SYGNATURA SPRAWY</TableCell>
              <TableCell>DATA UTWORZENIA</TableCell>
              <TableCell>DATA ODBIORU</TableCell>
              <TableCell>ODBIORCA</TableCell>
              <TableCell>STATUS ZLECENIA</TableCell>
              <TableCell padding="none" />
            </TableRow>
          </TableHead>
          <TableBody>
            {!ordersStore ? (
              <TableRow>
                <TableCell align="center" colSpan="20">
                  Ładowanie...
                </TableCell>
              </TableRow>
            ) : (
              ((disableFilter && ordersStore) || filterTableRecords()).map(
                ({
                  id,
                  docId,
                  customer,
                  signature,
                  createDate,
                  pickupDate,
                  employee,
                  status,
                  attachmentLink,
                }) => (
                  <TableRow key={id}>
                    <TableCell style={{ fontSize: 12 }}>{id}</TableCell>
                    <TableCell style={{ fontSize: 12 }}>{customer}</TableCell>
                    <TableCell style={{ fontSize: 12 }}>{signature}</TableCell>
                    <TableCell style={{ fontSize: 12 }}>
                      {createDate && moment(createDate).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell style={{ fontSize: 12 }}>
                      {pickupDate && moment(pickupDate).format('DD/MM/YYYY')}
                    </TableCell>
                    <TableCell style={{ fontSize: 12 }}>
                      {usersList[employee]}
                    </TableCell>
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
                          disabled={!!attachmentLink}
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
