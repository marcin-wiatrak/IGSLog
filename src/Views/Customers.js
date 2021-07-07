import {
  Button,
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
import fireDB from '../Firebase';
import { useEffect, useState } from 'react';
import MainWrapper from '../Components/MainWrapper/MainWrapper';
import NewCustomerModalBody from '../Components/NewCustomerModalBody';

const useStyles = makeStyles((theme) => ({
  controlsWrapper: {
    display: 'flex',
    margin: theme.spacing(3),
  },
}));

const Customers = () => {
  const [customers, setCustomers] = useState();
  const [modalOpen, setModalOpen] = useState(false);

  const classes = useStyles();
  useEffect(() => {
    const customersListRef = fireDB.database().ref('Customers');
    customersListRef.on('value', (snapshot) => {
      const customers = snapshot.val();
      const customersArray = [];
      for (let id in customers) {
        customersArray.push({ cId: id, ...customers[id] });
      }
      setCustomers(customersArray);
    });
  }, []);

  return (
    <MainWrapper>
      <TableContainer component={Paper} style={{ padding: 16 }} square>
        <div className={classes.controlsWrapper}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setModalOpen(true)}
          >
            Dodaj zleceniodawcę
          </Button>
        </div>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ADRES</TableCell>
              <TableCell>NAZWA FIRMY</TableCell>
              <TableCell>ZLECENIODAWCA</TableCell>
              <TableCell>NUMER TELEFONU</TableCell>
              <TableCell padding="none" />
            </TableRow>
          </TableHead>
          <TableBody>
            {!customers ? (
              <TableRow>
                <TableCell align="center" colSpan="20">
                  Ładowanie...
                </TableCell>
              </TableRow>
            ) : (
              customers.map(
                ({ address, companyName, cId, customerName, phoneNumber }) => (
                  <TableRow>
                    <TableCell style={{ fontSize: 12 }}>{address}</TableCell>
                    <TableCell style={{ fontSize: 12 }}>
                      {companyName}
                    </TableCell>
                    <TableCell style={{ fontSize: 12 }}>
                      {customerName}
                    </TableCell>
                    <TableCell style={{ fontSize: 12 }}>
                      {phoneNumber}
                    </TableCell>
                    <TableCell align="right" padding="checkbox"></TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          disableBackdropClick
        >
          <NewCustomerModalBody setCreateCustomerModal={setModalOpen} />
        </Modal>
      </TableContainer>
    </MainWrapper>
  );
};

export default Customers;
