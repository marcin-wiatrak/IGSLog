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
import { useContext, useState } from 'react';
import MainWrapper from '../Components/MainWrapper/MainWrapper';
import NewCustomerModalBody from '../Components/NewCustomerModalBody';
import { AuthContext } from '../Auth';

const useStyles = makeStyles((theme) => ({
  controlsWrapper: {
    display: 'flex',
    margin: theme.spacing(3),
  },
}));

const Customers = () => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = useState(false);

  const { customers } = useContext(AuthContext);

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
              <TableCell>ID</TableCell>
              <TableCell>ZLECENIODAWCA</TableCell>
              <TableCell>ADRES</TableCell>
              <TableCell>OSOBA DO KONTAKTU</TableCell>
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
                ({
                  address,
                  companyName,
                  customerId,
                  customerName,
                  phoneNumber,
                }) => (
                  <TableRow key={customerId}>
                    <TableCell style={{ fontSize: 12 }}>{customerId}</TableCell>
                    <TableCell style={{ fontSize: 12 }}>
                      {companyName}
                    </TableCell>
                    <TableCell style={{ fontSize: 12 }}>{address}</TableCell>
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
          <div>
            <NewCustomerModalBody setCreateCustomerModal={setModalOpen} />
          </div>
        </Modal>
      </TableContainer>
    </MainWrapper>
  );
};

export default Customers;
