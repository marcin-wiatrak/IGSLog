import MainWrapper from '../Components/MainWrapper/MainWrapper';
import OrdersTable from '../Components/OrdersTable';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  heading: {
    fontWeight: 'bold',
  },
});

const Biology = () => {
  const classes = useStyles();
  return (
    <MainWrapper>
      <Typography
        variant="h4"
        color="textSecondary"
        gutterBottom
        className={classes.heading}
      >
        BIOLOGIA
      </Typography>
      <OrdersTable tab="biologia" />
    </MainWrapper>
  );
};

export default Biology;
