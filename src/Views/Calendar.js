import MainWrapper from '../Components/MainWrapper/MainWrapper';
import moment from 'moment';
import clsx from 'clsx';
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup, Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Paper,
  TextField,
  Typography
} from '@material-ui/core';
import {
  ArrowBack,
  ArrowForward,
  AssignmentTurnedIn,
  FlightLand,
  FlightTakeoff,
  NewReleases,
  Notes, Person
} from '@material-ui/icons';
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../Data';
import { DatePicker } from '@material-ui/pickers';
import fireDB from '../Firebase';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    height: '100%',
  },
  heading: {
    fontWeight: 'bold',
  },
  calendar: {
    maxWidth: 840,
  },
  calendarWeek: {
    display: 'flex',
  },
  calendarDay: {
    position: 'relative',
    padding: 6,
    width: 120,
    height: 120,
    border: `1px solid ${theme.palette.grey[300]}`,
  },
  calendarLabel: {
    textTransform: 'uppercase',
    width: 120,
    textAlign: 'center',
    fontSize: '0.8rem',
    color: theme.palette.grey[400],
  },
  outOfCurrentMonth: {
    color: theme.palette.grey[400],
  },
  dayLabel: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: '0.05',
    lineHeight: 'normal',
    fontSize: 60,
    zIndex: 0,
    cursor: 'default',
  },
  calendarThisDay: {
    color: 'red',
    opacity: '0.3',
  },
  dayContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    zIndex: 1,
  },
  dayContentInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    '& > *': {
      fontSize: 10,
    },
  },
  calendarControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarToday: {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      outline: `3px solid ${theme.palette.primary.main}`,
      borderRadius: '3px',
      zIndex: 1000,
    },
  },
  ordersCounterLabel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayContentNotes: {
    position: 'absolute',
    bottom: 0,
    right: 5,
  },
  dayContentHolidays: {
    position: 'absolute',
    bottom: 0,
    left: 5,
  },
}));

const weekDaysLabels = [
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
  'Niedziela',
];

const Calendar = () => {
  const classes = useStyles();
  const [calendar, setCalendar] = useState([]);
  const [today, setToday] = useState(moment());
  const [todayData, setTodayData] = useState(null);
  const [addHolidayDialog, setAddHolidayDialog] = useState(true);
  const [holidaySelectedEmployee, setHolidaySelectedEmployee] = useState('');
  const [holidayDateFrom, setHolidayDateFrom] = useState(null);
  const [holidayDateTo, setHolidayDateTo] = useState(null);
  const [holidaySingleDay, setHolidaySingleDay] = useState(false);

  const currentMonth = today.clone().format('MMMM');
  const currentYear = today.clone().format('YYYY');

  const prevMonth = () => {
    return today.clone().startOf('month').subtract(1, 'month');
  };

  const nextMonth = () => {
    return today.clone().startOf('month').add(1, 'month');
  };

  const { orders, usersList, holidays } = useContext(DataContext);

  console.log(holidays);

  console.log(holidaySingleDay);

  const filteredOrders = (start, end) => {
    return orders.filter(
      (order) =>
        order.createDate >= start.format() && order.createDate <= end.format()
    );
  };

  const createHoliday = async () => {
    const element = {
      user: holidaySelectedEmployee,
      singleDay: holidaySingleDay,
      dateFrom: holidayDateFrom,
      dateTo: holidayDateTo || null,
    };
    const pushTaskRef = fireDB.database().ref('Calendar');
    pushTaskRef.push(element);
    setAddHolidayDialog(false);
  };

  const changeEmployeeHandler = (event) =>
    setHolidaySelectedEmployee(event.target.value);

  const clearInputs = () => {
    setHolidaySelectedEmployee('');
    setHolidayDateFrom(null);
    setHolidayDateTo(null);
    setHolidaySingleDay(false);
  };

  const renderAddHolidayDialog = () => (
    <Dialog
      open={addHolidayDialog}
      onClose={() => setAddHolidayDialog(false)}
      TransitionProps={{
        onExited: clearInputs,
      }}
    >
      <DialogTitle>Dodaj urlop</DialogTitle>
      <DialogContent>
        <TextField
          label="Pracownik"
          select
          variant="outlined"
          fullWidth
          onChange={changeEmployeeHandler}
          value={holidaySelectedEmployee}
        >
          {Object.entries(usersList).map(([uId, name]) => (
            <MenuItem value={uId}>{name}</MenuItem>
          ))}
        </TextField>
        <FormGroup style={{ marginTop: 16 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={holidaySingleDay}
                onChange={(e) => setHolidaySingleDay(e.target.checked)}
              />
            }
            label="Jeden dzień"
          />
        </FormGroup>
        <DatePicker
          label={`Data${holidaySingleDay ? '' : ` rozpoczęcia` }`}
          value={holidayDateFrom}
          onChange={(date) =>
            setHolidayDateFrom(moment(date).startOf('day').format())
          }
          fullWidth
          format="DD/MM/YYYY"
          autoOk
        />
        {!holidaySingleDay && (
          <DatePicker
            label="Data zakończenia"
            value={holidayDateTo}
            onChange={(date) => setHolidayDateTo(moment(date).endOf('day').format())}
            fullWidth
            format="DD/MM/YYYY"
            autoOk
            disabled={holidaySingleDay}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={createHoliday}
        >
          Dodaj
        </Button>
      </DialogActions>
    </Dialog>
  );

  useEffect(() => {
    const startDay = today
      .clone()
      .startOf('month')
      .startOf('week')
      .isoWeekday(2);
    const endDay = today.clone().endOf('month').endOf('week');
    const day = startDay.clone().subtract(2, 'day');
    const filteredList = filteredOrders(startDay, endDay);
    const tempCalendar = [];
    while (day.isBefore(endDay, 'day')) {
      tempCalendar.push(
        Array(7)
          .fill(0)
          .map(() => {
            const addDay = day.add(1, 'day').clone();
            const orders =
              filteredList.filter((order) => {
                return (
                  moment(order.createDate).format('D') === addDay.format('D')
                );
              }) || [];
            const holidaysTemp =
              holidays.filter((item) =>
                  (!item.singleDay &&
                    (moment(item.dateFrom).isBefore(addDay) || moment(item.dateFrom).isSame(addDay)) &&
                    moment(item.dateTo).isAfter(addDay)) ||
                  (item.singleDay && moment(item.dateFrom).isSame(addDay))
              ) || [];
            console.log(moment(addDay).format('YYYY-MM-DD'), holidaysTemp);
            return { day: addDay, orders, holidays: holidaysTemp };
          })
      );
    }
    console.log(tempCalendar);
    setCalendar(tempCalendar);
  }, [today]);

  console.log(todayData);

  return (
    <MainWrapper>
      <Typography
        variant="h4"
        color="textSecondary"
        gutterBottom
        className={classes.heading}
      >
        Kalendarz
      </Typography>
      <Paper className={classes.paper}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setAddHolidayDialog(true)}
        >
          Dodaj urlop
        </Button>
        <Grid container spacing={2}>
          <Grid item lg={8} xs={12}>
            <div className={classes.calendar}>
              <div className={classes.calendarControls}>
                <IconButton onClick={() => setToday(prevMonth())}>
                  <ArrowBack />
                </IconButton>
                <Typography variant="h6">{`${currentMonth.toUpperCase()} ${currentYear}`}</Typography>
                <IconButton onClick={() => setToday(nextMonth())}>
                  <ArrowForward />
                </IconButton>
              </div>
              <div className={classes.calendarWeek}>
                {weekDaysLabels.map((label) => (
                  <div key={label} className={classes.calendarLabel}>
                    {label}
                  </div>
                ))}
              </div>
              {calendar.map((week, i) => (
                <div key={'week' + i} className={classes.calendarWeek}>
                  {week.map((day) => {
                    const ordersCounter = day.orders.reduce(
                      (acc, item) => {
                        acc[item.status] = acc[item.status] + 1;
                        return acc;
                      },
                      { NEW_TASK: 0, PICKED_UP: 0, DELIVERED: 0, CLOSED: 0 }
                    );
                    if (
                      day.day.isBefore(today.clone().startOf('month')) ||
                      day.day.isAfter(today.clone().endOf('month'))
                    ) {
                      return (
                        <div
                          key={`baday${day.day}`}
                          className={clsx(
                            classes.calendarDay,
                            classes.outOfCurrentMonth
                          )}
                          onClick={() => {
                            setToday(day.day);
                            setTodayData(day);
                          }}
                        >
                          {day.day.format('D').toString()}
                        </div>
                      );
                    }
                    return (
                      <div
                        key={`day${day.day}`}
                        className={clsx(
                          classes.calendarDay,
                          today.isSame(day.day, 'day') && classes.calendarToday
                        )}
                        onClick={() => {
                          setToday(day.day);
                          setTodayData(day);
                        }}
                      >
                        <div
                          className={clsx(
                            classes.dayLabel,
                            moment().isSame(day.day, 'day') &&
                              classes.calendarThisDay
                          )}
                        >
                          {day.day.format('D').toString()}
                        </div>
                        <div className={classes.dayContent}>
                          <div className={classes.dayContentInfo}>
                            {ordersCounter.NEW_TASK ? (
                              <div className={classes.ordersCounterLabel}>
                                <NewReleases
                                  style={{ color: '#a1a1a1', fontSize: 15 }}
                                />
                                <Typography>{ordersCounter.NEW_TASK}</Typography>
                              </div>
                            ) : null}
                            {ordersCounter.PICKED_UP ? (
                              <div className={classes.ordersCounterLabel}>
                                <FlightTakeoff
                                  style={{ color: '#03a1fc', fontSize: 15 }}
                                />
                                <Typography>{ordersCounter.PICKED_UP}</Typography>
                              </div>
                            ) : null}
                            {ordersCounter.DELIVERED ? (
                              <div className={classes.ordersCounterLabel}>
                                <FlightLand
                                  style={{ color: '#f385ff', fontSize: 15 }}
                                />
                                <Typography>{ordersCounter.DELIVERED}</Typography>
                              </div>
                            ) : null}
                            {ordersCounter.CLOSED ? (
                              <div className={classes.ordersCounterLabel}>
                                <AssignmentTurnedIn
                                  style={{ color: '#00ba06', fontSize: 15 }}
                                />
                                <Typography>{ordersCounter.CLOSED}</Typography>
                              </div>
                            ) : null}
                          </div>
                          {(!!day.holidays && !!day.holidays.length) && (
                            <div className={classes.dayContentHolidays}>
                              <Person />
                            </div>
                          )}
                          {(!!day.notes && !!day.notes.length) && (
                            <div className={classes.dayContentNotes}>
                              <Notes />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </Grid>
          {!!todayData && (
            <Grid lg={4} xs={12}>
              <Typography variant="h5" align="center">{moment(today).format('dddd DD/MM/YYYY')}</Typography>
              {!!todayData.holidays.length && (
                <>
                  <Typography variant="h6">Urlopy:</Typography>
                  {todayData.holidays.map((el) => (
                    <Typography variant="body1">{`${usersList[el.user]}:  ${el.dateTo ? `${moment(el.dateFrom).format('DD/MM')}-${moment(el.dateTo).format('DD/MM/YYYY')}` : moment(el.dateFrom).format('DD/MM')}`}</Typography>
                  ))}
                </>
              )}
            </Grid>
          )}
        </Grid>
      </Paper>
      {renderAddHolidayDialog()}
    </MainWrapper>
  );
};

export default Calendar;
