import MainWrapper from '../Components/MainWrapper/MainWrapper';
import moment from 'moment';
import clsx from 'clsx';
import { IconButton, makeStyles, Paper, Typography } from '@material-ui/core';
import { ArrowBack, ArrowForward, Notes } from '@material-ui/icons';
import { useEffect, useState } from 'react';

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
  dayContent: {
    zIndex: 1,
  },
  dayContentInfo: {
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
    backgroundColor: theme.palette.primary.light,
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

  useEffect(() => {
    const startDay = today
      .clone()
      .startOf('month')
      .startOf('week')
      .isoWeekday(2);
    const endDay = today.clone().endOf('month').endOf('week');
    const day = startDay.clone().subtract(2, 'day');
    const tempCalendar = [];
    while (day.isBefore(endDay, 'day')) {
      tempCalendar.push(
        Array(7)
          .fill(0)
          .map(() => day.add(1, 'day').clone())
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
              <div className={classes.calendarLabel}>{label}</div>
            ))}
          </div>
          {calendar.map((week) => (
            <div className={classes.calendarWeek}>
              {week.map((day) => {
                if (
                  day.isBefore(today.clone().startOf('month')) ||
                  day.isAfter(today.clone().endOf('month'))
                ) {
                  return (
                    <div
                      className={clsx(
                        classes.calendarDay,
                        classes.outOfCurrentMonth
                      )}
                      onClick={() => setToday(day)}
                    >
                      {day.format('D').toString()}
                    </div>
                  );
                }
                return (
                  <div
                    className={clsx(
                      classes.calendarDay,
                      today.isSame(day, 'day') && classes.calendarToday
                    )}
                    onClick={() => setToday(day)}
                  >
                    <div className={classes.dayLabel}>
                      {day.format('D').toString()}
                    </div>
                    <div className={classes.dayContent}>
                      <div className={classes.dayContentInfo}>
                        <Typography variant="body2">Za: 1</Typography>
                        <Typography variant="body2">Od: 1</Typography>
                        <Typography variant="body2">Do: 5</Typography>
                        <Typography variant="body2">Pnd: 5</Typography>
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
