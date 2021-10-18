import MainWrapper from '../Components/MainWrapper/MainWrapper';
import moment from 'moment';
import clsx from 'clsx';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { Notes } from '@material-ui/icons';


const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    height: '100%',
  },
  heading: {
    fontWeight: 'bold',
  },
  calendar: {},
  calendarWeek: {
    display: 'flex',
  },
  calendarDay: {
    position: 'relative',
    padding: 6,
    width: 120,
    height: 120,
    border: '1px solid black',
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
}));

const Calendar = () => {
  const classes = useStyles();

  const today = moment();
  const startDay = today.clone().startOf('month').startOf('week').isoWeekday(2);
  const endDay = today.clone().endOf('month').endOf('week');
  const day = startDay.clone().subtract(2, 'day');
  const calendar = [];

  const weekDaysLabels = [
    'Poniedziałek',
    'Wtorek',
    'Środa',
    'Czwartek',
    'Piątek',
    'Sobota',
    'Niedizela',
  ];

  while (day.isBefore(endDay, 'day')) {
    calendar.push(
      Array(7)
        .fill(0)
        .map(() => day.add(1, 'day').clone())
    );
  }

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
                    >
                      {day.format('D').toString()}
                    </div>
                  );
                }
                return (
                  <div className={classes.calendarDay}>
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
                      <div className={classes.dayCOntentNotes}>
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
