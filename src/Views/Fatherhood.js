import MainWrapper from '../Components/MainWrapper/MainWrapper';
import OrdersTable from '../Components/OrdersTable';
import { makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles({
  heading: {
    fontWeight: 'bold',
  },
});

const Fatherhood = () => {
  const classes = useStyles();
  return (
    <MainWrapper>
      <Typography
        variant="h4"
        color="textSecondary"
        gutterBottom
        className={classes.heading}
      >
        USTALANIE OJCOSTWA
      </Typography>
      <OrdersTable tab="fatherhood" />
    </MainWrapper>
  );
};

export default Fatherhood;
