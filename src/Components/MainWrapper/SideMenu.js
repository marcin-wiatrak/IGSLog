import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import {
  DeviceHub,
  Face,
  Eco,
  Spa,
  People,
  Dashboard,
  Tune,
  Today,
} from '@material-ui/icons';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { checkPermissions } from '../../utils';
import { DataContext } from '../../Data';

const drawerWidth = 270;

const useStyles = makeStyles((theme) => ({
  sideMenu: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
    padding: '30px 0',
  },
  'Mui-selectedd': {
    backgroundColor: theme.palette.primary.main,
    '& .MuiListItemText-root': {
      color: theme.palette.common.white,
    },
    '& .MuiListItemIcon-root': {
      color: theme.palette.common.white,
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const SideMenu = ({ menuOpen }) => {
  const classes = useStyles();
  const { currentUserProfile } = useContext(DataContext);
  if (!currentUserProfile) return null;
  return (
    <>
      <Drawer
        variant="persistent"
        anchor="left"
        open={menuOpen}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.sideMenu}>
          <List component="nav">
            <ListItem
              button
              component={NavLink}
              to="/dashboard"
              exact
              activeClassName={classes['Mui-selectedd']}
            >
              <ListItemIcon>
                <Dashboard />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem
              button
              component={NavLink}
              to="/ustalanie_ojcostwa"
              activeClassName={classes['Mui-selectedd']}
            >
              <ListItemIcon>
                <Face />
              </ListItemIcon>
              <ListItemText primary="Ustalanie ojcostwa" />
            </ListItem>
            <ListItem
              button
              component={NavLink}
              to="/toksykologia"
              activeClassName={classes['Mui-selectedd']}
            >
              <ListItemIcon>
                <Spa />
              </ListItemIcon>
              <ListItemText primary="Toksykologia" />
            </ListItem>
            <ListItem
              button
              component={NavLink}
              to="/fizykochemia"
              activeClassName={classes['Mui-selectedd']}
            >
              <ListItemIcon>
                <DeviceHub />
              </ListItemIcon>
              <ListItemText primary="Fizykochemia" />
            </ListItem>
            <ListItem
              button
              component={NavLink}
              to="/biologia"
              activeClassName={classes['Mui-selectedd']}
            >
              <ListItemIcon>
                <Eco />
              </ListItemIcon>
              <ListItemText primary="Biologia" />
            </ListItem>
          </List>
          <List component="nav">
            <ListItem
              button
              component={NavLink}
              to="/zleceniodawcy"
              activeClassName={classes['Mui-selectedd']}
            >
              <ListItemIcon>
                <People />
              </ListItemIcon>
              <ListItemText primary="Zleceniodawcy" />
            </ListItem>
            <ListItem
              button
              component={NavLink}
              to="/kalendarz"
              activeClassName={classes['Mui-selectedd']}
              style={{ display: 'none' }}
            >
              <ListItemIcon>
                <Today />
              </ListItemIcon>
              <ListItemText primary="Kalendarz" />
            </ListItem>
            {checkPermissions('admin', currentUserProfile.permissions) && (
              <ListItem
                button
                component={NavLink}
                to="/admin"
                activeClassName={classes['Mui-selectedd']}
              >
                <ListItemIcon>
                  <Tune />
                </ListItemIcon>
                <ListItemText primary="Administracja" />
              </ListItem>
            )}
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default SideMenu;
