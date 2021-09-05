import MainWrapper from '../Components/MainWrapper/MainWrapper';
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Paper,
  Typography,
} from '@material-ui/core';
import React, { useContext } from 'react';
import { DataContext } from '../Data';
import {
  AssignmentTurnedIn,
  DeviceHub,
  Eco,
  Face,
  FiberManualRecord,
  FlightLand,
  FlightTakeoff,
  NewReleases,
  Spa,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    height: '100%',
  },
}));

const Dashboard = () => {
  const { orders } = useContext(DataContext);
  const classes = useStyles();
  if (!orders) return null;
  return (
    <MainWrapper>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper square className={classes.paper}>
            <Typography gutterBottom variant="h6">
              Łączna liczba zleceń: {orders.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={true}>
          <Paper square className={classes.paper}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <Face />
                </ListItemIcon>
                <ListItemText
                  primary={`Ustalanie ojcostwa: ${
                    orders.filter((ord) => ord.type === 'fatherhood').length
                  }`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Spa />
                </ListItemIcon>
                <ListItemText
                  primary={`Toksykologia: ${
                    orders.filter((ord) => ord.type === 'toxicology').length
                  }`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <DeviceHub />
                </ListItemIcon>
                <ListItemText
                  primary={`Fizykochemia: ${
                    orders.filter((ord) => ord.type === 'physicochemistry')
                      .length
                  }`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Eco />
                </ListItemIcon>
                <ListItemText
                  primary={`Biologia: ${
                    orders.filter((ord) => ord.type === 'biologia').length
                  }`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={true}>
          <Paper square className={classes.paper}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <NewReleases />
                </ListItemIcon>
                <ListItemText
                  primary={`Zarejestrowane: ${
                    orders.filter((ord) => ord.status === 'NEW_TASK').length
                  }`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FlightTakeoff style={{ color: '#03a1fc' }} />
                </ListItemIcon>
                <ListItemText
                  primary={`Odebrane: ${
                    orders.filter((ord) => ord.status === 'PICKED_UP').length
                  }`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FlightLand style={{ color: '#f385ff' }} />
                </ListItemIcon>
                <ListItemText
                  primary={`Dostarczone: ${
                    orders.filter((ord) => ord.status === 'DELIVERED').length
                  }`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <AssignmentTurnedIn style={{ color: '#00ba06' }} />
                </ListItemIcon>
                <ListItemText
                  primary={`Przekazane na dział: ${
                    orders.filter((ord) => ord.status === 'CLOSED').length
                  }`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={true}>
          <Paper square className={classes.paper}>
            <List>
              <ListItem>
                <ListItemIcon>
                  <FiberManualRecord />
                </ListItemIcon>
                <ListItemText
                  primary={`Odbiór nieustalony: ${
                    orders.filter((ord) => !ord.employeeDriver).length
                  }`}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <FiberManualRecord />
                </ListItemIcon>
                <ListItemText
                  primary={`Odbiór ustalony: ${
                    orders.filter((ord) => ord.employeeDriver).length
                  }`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </MainWrapper>
  );
};

// Łączna liczba zadań, liczba zadań dla każdej zakładki, Liczba zadań podział na statusy,

export default Dashboard;
