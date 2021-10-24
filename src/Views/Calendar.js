import MainWrapper from '../Components/MainWrapper/MainWrapper';
import moment from 'moment';
import clsx from 'clsx';
import { IconButton, makeStyles, Paper, Typography } from '@material-ui/core';
import {
  ArrowBack,
  ArrowForward,
  AssignmentTurnedIn,
  FlightLand,
  FlightTakeoff,
  NewReleases,
  Notes,
} from '@material-ui/icons';
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../Data';

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
    marginTop: 'auto',
    alignSelf: 'flex-end',
  },
}));

const weekDaysLabels = [
  'Poniedziałek',
  'Wtorek',
  'Środa',
  'Czwartek',
  'Piątek',
  'Sobota',
  'Niedizela',
];

const Calendar = () => {
  const classes = useStyles();
  const [calendar, setCalendar] = useState([]);
  const [today, setToday] = useState(moment());

  const currentMonth = today.clone().format('MMMM');
  const currentYear = today.clone().format('YYYY');

  const prevMonth = () => {
    return today.clone().startOf('month').subtract(1, 'month');
  };

  const nextMonth = () => {
    return today.clone().startOf('month').add(1, 'month');
  };

  const { orders } = useContext(DataContext);

  const filteredOrders = (start, end) => {
    return orders.filter(
      (order) =>
        order.createDate >= start.format() && order.createDate <= end.format()
    );
  };

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
            return { day: addDay, orders };
          })
      );
    }
    setCalendar(tempCalendar);
  }, [today]);

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
              <div key={label} className={classes.calendarLabel}>{label}</div>
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
                      onClick={() => setToday(day.day)}
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
                    onClick={() => setToday(day.day)}
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
                      <div className={classes.dayContentNotes}>
                        <Notes />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </Paper>
    </MainWrapper>
  );
};

export default Calendar;
