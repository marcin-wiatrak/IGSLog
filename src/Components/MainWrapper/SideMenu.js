import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core';
import { DeviceHub, Face, Eco, Spa, People, Dashboard } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  sideMenu: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    left: 0,
    width: '270px',
    height: '100%',
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[3],
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

const SideMenu = () => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.sideMenu}>
        <List component="nav">
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
          <ListItem
            button
            component={NavLink}
            to="/admin"
            activeClassName={classes['Mui-selectedd']}
          >
            <ListItemIcon>
              <Dashboard />
            </ListItemIcon>
            <ListItemText primary="Administracja" />
          </ListItem>
        </List>
      </div>
    </>
  );
};

export default SideMenu;
