import {
  AppBar,
  Grid,
  IconButton,
  Toolbar,
  makeStyles,
  Menu,
  Typography,
  Button,
  Modal,
  Paper,
} from '@material-ui/core';
import { AccountCircle, PowerSettingsNew } from '@material-ui/icons';
import { useContext, useState } from 'react';
import fireDB from '../../Firebase';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import { DataContext } from '../../Data';

const useStyles = makeStyles((theme) => ({
  lightIcon: {
    color: theme.palette.common.white,
  },
  userMenu: {
    minWidth: 300,
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
  paper: {
    width: '500px',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    padding: theme.spacing(3),
  },
}));

const Header = ({ history }) => {
  const classes = useStyles();
  const { currentUserProfile } = useContext(DataContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutTime, setLogoutTime] = useState('30');
  const [modalOpen, setModalOpen] = useState(false);

  const openUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logOut = () => {
    localStorage.removeItem('authToken');
    fireDB.auth().signOut();
    return <Redirect to={'/'} />;
  };

  setInterval(() => {
    const difference = moment(localStorage.getItem('logoutTime')).diff(
      moment()
    );
    const duration = moment.duration(difference).minutes();
    if (duration < 0) {
      setModalOpen(true);
    } else if (duration >= 0) {
      setLogoutTime(duration);
    }
  }, 1000);

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container>
          <Grid item>
            <Typography>
              {`Wylogowanie nastąpi za ${logoutTime} minut`}
            </Typography>
          </Grid>
          <Grid item sm />
          <Grid item>
            <IconButton onClick={openUserMenu}>
              <AccountCircle className={classes.lightIcon} />
            </IconButton>
            <IconButton onClick={logOut}>
              <PowerSettingsNew className={classes.lightIcon} />
            </IconButton>
            <Menu
              id="simple-menu"
              anchorEl={anchorEl}
              keepMounted
              open={!!anchorEl}
              onClose={handleClose}
              style={{ marginTop: 32 }}
            >
              {currentUserProfile && (
                <div className={classes.userMenu}>
                  <div className={classes.profilePhoto}>
                    {currentUserProfile.initials}
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
              )}
            </Menu>
          </Grid>
        </Grid>
      </Toolbar>
      <Modal open={modalOpen} disableBackdropClick>
        <Paper className={classes.paper}>
          <Typography variant="h5" gutterBottom>
            Zostałeś wylogowany
          </Typography>
          <Typography variant="body1">
            Ze względu na zbyt długą nieaktywność nastąpiło wylogowanie
          </Typography>
          <Button
            color="primary"
            variant="contained"
            className={classes.button}
            onClick={() => window.location.reload()}
          >
            ZALOGUJ PONOWNIE
          </Button>
        </Paper>
      </Modal>
    </AppBar>
  );
};

export default Header;
