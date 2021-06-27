import MomentUtils from '@date-io/moment';
import { Button, FormGroup, TextField, Modal } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import moment from 'moment';
import 'moment/locale/pl';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import fireDB from '../Firebase';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border: 1px solid black;
  background-color: rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(3px);
`;

const ModalHeader = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;

  button {
    background: none;
    outline: none;
    border: none;
    transition: ease 0.3s;
    padding: 4px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    svg {
      display: block;
      font-size: 20px;
    }
  }
`;

const ModalContent = styled.div`
  padding: 20px 0;
`;

const ModalFooter = styled.div`
  display: flex;
  padding: 15px;
  justify-content: space-evenly;
`;

const NewOrderModal = ({ modalOpen, setModalOpen, iterator, updateIterator }) => {
  const [pickupDate, setPickupDate] = useState(moment().format());
  const [localization, setLocalization] = useState('');
  const [customer, setCustomer] = useState('');
  const [signature, setSignature] = useState('');
  const [notes, setNotes] = useState('');
  const [customerReset, setCustomerReset] = useState(false);
  const [customers, setCustomers] = useState(['No customers', 'Another']);

  useEffect(() => {
    const customers = fireDB.database().ref('Customers');
    customers.on('value', (snapshot) => {
      const customers = snapshot.val();
      const customersList = [];
      for (let item in customers) {
        customersList.push(customers[item].customerName);
      }
      setCustomers(customersList);
    });
  }, []);

  const resetForm = () => {
    setPickupDate(new Date());
    setLocalization('');
    setCustomerReset(!customerReset);
    setSignature('');
    setNotes('');
  };

  const createTaskHandler = () => {
    const task = {
      id: iterator,
      customer,
      createDate: '' + moment().format(),
      pickupDate: '' + pickupDate,
      employee: 'user name',
      localization,
      status: 'NEW_TASK',
      notes,
      signature,
      type: 1,
    };

    const pushTaskRef = fireDB.database().ref('Orders');
    pushTaskRef.push(task);
    setModalOpen(false);
    updateIterator();
  };

  return (
    <Wrapper>
      <Modal>
        <ModalHeader>
          <h2>Nowe zlecenie #{iterator}</h2>
          <button onClick={() => setModalOpen(false)}>
            <CloseRounded style={{ width: 30, height: 30 }} />
          </button>
        </ModalHeader>
        <ModalContent>
          <FormGroup row>
            <MuiPickersUtilsProvider utils={MomentUtils} locale="pl">
              <KeyboardDatePicker
                format="DD MMM YYYY"
                label="Data utworzenia"
                value={moment().format()}
                minDate={moment()}
                style={{ marginRight: '10px' }}
                KeyboardButtonProps={{
                  'aria-label': 'Zmień datę',
                }}
                disabled
              />
              <KeyboardDatePicker
                format="DD MMM YYYY"
                label="Data odbioru"
                value={pickupDate}
                onChange={(e) => setPickupDate(moment(e._d).format())}
                minDate={moment()}
                style={{ marginLeft: '10px' }}
                KeyboardButtonProps={{
                  'aria-label': 'Zmień datę',
                }}
              />
            </MuiPickersUtilsProvider>
          </FormGroup>
          <TextField
            label="Miejsce docelowe"
            fullWidth
            margin="normal"
            value={localization}
            onChange={(e) => setLocalization(e.target.value)}
          />
          <Autocomplete
            options={customers}
            key={customerReset}
            getOptionLabel={(option) => option}
            onInputChange={(e, newValue) => setCustomer(newValue)}
            openOnFocus
            renderInput={(params) => (
              <TextField {...params} label="Zleceniodawca" value={customer} />
            )}
          />
          <TextField
            label="Kod zlecenia"
            value={signature}
            fullWidth
            margin="normal"
            onChange={(e) => setSignature(e.target.value)}
          />
          <TextField
            label="Notatki"
            fullWidth
            multiline
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </ModalContent>
        <ModalFooter>
          <Button onClick={resetForm}>Wyczyść formularz</Button>
          <Button color="primary" onClick={createTaskHandler}>
            Dodaj zlecenie
          </Button>
        </ModalFooter>
      </Modal>
    </Wrapper>
  );
};

export default NewOrderModal;
