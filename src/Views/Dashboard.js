import MainWrapper from '../Components/MainWrapper/MainWrapper';
import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    height: '100%',
  },
}));

const Dashboard = () => {
  const classes = useStyles();
  return (
    <MainWrapper>
      <Grid container spacing={0}>
        <Grid item xs={true}>
          <Paper square className={classes.paper}>
            <Typography gutterBottom variant="h6">
              Łączna liczba zleceń: 356
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={true}>
          <Paper square className={classes.paper}>
            <Typography gutterBottom variant="h6">
              Liczba zleceń z podziałem na kategorie:
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={true}>
          <Paper square className={classes.paper}>
            <Typography gutterBottom variant="h6">
              Liczba zleceń według statusów:
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </MainWrapper>
  );
};

// Łączna liczba zadań, liczba zadań dla każdej zakładki, Liczba zadań podział na statusy,

export default Dashboard;
