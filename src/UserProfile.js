import React from 'react';
import MainWrapper from './Components/MainWrapper/MainWrapper';
import { Button, Typography } from '@material-ui/core';

const UserProfile = () => {
  return (
    <MainWrapper>
      <Typography>Zmiana hasła</Typography>
      <Button>Zmiana hasła</Button>
    </MainWrapper>
  );
};

export default UserProfile;
