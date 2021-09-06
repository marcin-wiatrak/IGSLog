import { CssBaseline, makeStyles } from '@material-ui/core';
import Header from './Header';
import SideMenu from './SideMenu';
import { useState } from 'react';
import classNames from 'classnames';

const drawerWidth = 270;

const useStyles = makeStyles((theme) => ({
  content: {
    padding: theme.spacing(3),
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
}));

const MainWrapper = ({ children }) => {
  const classes = useStyles();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenuOpen = () => setMenuOpen(!menuOpen);

  return (
    <>
      <SideMenu menuOpen={menuOpen} />
      <Header toggleMenuOpen={toggleMenuOpen} menuOpen={menuOpen} />
      <div
        className={classNames(classes.content, classes.appBar, {
          [classes.appBarShift]: menuOpen,
        })}
      >
        {children}
      </div>
      <CssBaseline />
    </>
  );
};

export default MainWrapper;
