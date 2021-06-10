import {
  AppBar,
  Grid,
  IconButton,
  Toolbar,
  makeStyles,
  Menu,
} from '@material-ui/core';
import { AccountCircle, PowerSettingsNew } from '@material-ui/icons';
import { useState } from 'react';
import fireDB from '../../Firebase';

const useStyles = makeStyles((theme) => ({
  lightIcon: {
    color: theme.palette.common.white,
  },
}));

const Header = (props) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);

  const openUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container>
          <Grid item></Grid>
          <Grid item sm></Grid>
          <Grid item>
            <IconButton>
              <AccountCircle
                className={classes.lightIcon}
                onClick={openUserMenu}
              />
            </IconButton>
            <IconButton onClick={() => fireDB.auth().signOut()}>
              <PowerSettingsNew className={classes.lightIcon} />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              test
            </Menu>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
