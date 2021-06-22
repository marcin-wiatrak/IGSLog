import {
  AppBar,
  Grid,
  IconButton,
  Toolbar,
  makeStyles,
  Menu,
  Typography,
  Button,
} from '@material-ui/core';
import { AccountCircle, PowerSettingsNew } from '@material-ui/icons';
import { useContext, useState } from 'react';
import fireDB from '../../Firebase';
import { AuthContext } from '../../Auth';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  lightIcon: {
    color: theme.palette.common.white,
  },
  userMenu: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    padding: theme.spacing(2),
  },
  profilePhoto: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 700,
    fontSize: 35,
    width: 100,
    height: 100,
    backgroundColor: theme.palette.grey[300],
    borderRadius: '50%',
    margin: '0 auto 16px auto',
    boxShadow: theme.shadows[3],
  },
  button: {
    marginTop: theme.spacing(2),
  },
}));

const Header = (props) => {
  const classes = useStyles();
  const { currentUserProfile } = useContext(AuthContext);

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
          <Grid item />
          <Grid item sm />
          <Grid item>
            <IconButton onClick={openUserMenu}>
              <AccountCircle className={classes.lightIcon} />
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
              <div className={classes.userMenu}>
                <div
                  className={classes.profilePhoto}
                >
                  {`${currentUserProfile.firstName}${currentUserProfile.lastName}`}
                </div>
                <Typography
                  variant="body1"
                  align="center"
                  gutterBottom
                >{`${currentUserProfile.firstName} ${currentUserProfile.lastName}`}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {currentUserProfile.email}
                </Typography>
                <Button
                  className={classes.button}
                  component={Link}
                  to={'/profil'}
                  variant="contained"
                  color="primary"
                >
                  Profil
                </Button>
              </div>
            </Menu>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
