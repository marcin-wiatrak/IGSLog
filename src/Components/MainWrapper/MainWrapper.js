import { CssBaseline, makeStyles } from '@material-ui/core';
import Header from './Header';
import SideMenu from './SideMenu';

const useStyles = makeStyles((theme) => ({
  main: {
    paddingLeft: '270px',
    width: '100%',
  },
  content: {
    padding: theme.spacing(3),
  },
}));

const MainWrapper = ({ children }) => {
  const classes = useStyles();
  return (
    <>
      <SideMenu />
      <div className={classes.main}>
        <Header />
        <div className={classes.content}>{children}</div>
      </div>
      <CssBaseline />
    </>
  );
};

export default MainWrapper;
