import MainWrapper from '../Components/MainWrapper/MainWrapper';
import OrdersTable from '../Components/OrdersTable';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  heading: {
    fontWeight: 'bold',
  },
});

const Toxicology = () => {
  const classes = useStyles();
  return (
    <MainWrapper>
      <Typography
        variant="h4"
        color="textSecondary"
        gutterBottom
        className={classes.heading}
      >
        TOKSYKOLOGIA
      </Typography>
      <OrdersTable tab="toxicology" />
    </MainWrapper>
  );
};

export default Toxicology;
