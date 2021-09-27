import MainWrapper from '../Components/MainWrapper/MainWrapper';
import { IconButton, makeStyles, Paper, Typography } from '@material-ui/core';
import moment from 'moment';
import { ArrowBackIos, ArrowForwardIos } from '@material-ui/icons';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    height: '100%',
  },
  heading: {
    fontWeight: 'bold',
  },
  calendar: {
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gridTemplateRows: '40px repeat(5, 100px)',
    gridTemplateAreas: `'header header header header header header header'
    '. . . . . . .'
    '. . . . . . .'
    '. . . . . . .'
    `,
    gridGap: 1,
    border: '1px solid black',
    backgroundColor: 'black',
    '& > div:not(:first-child)': {
      padding: 5,
      backgroundColor: 'white',
    },
  },
  calendar4Rows: {
    gridTemplateRows: '40px repeat(4, 100px)',
  },
  calendar6Rows: {
    gridTemplateRows: '40px repeat(6, 100px)',
  },
  calendarHeader: {
    display: 'grid',
    gridColumn: '100%',
    gridArea: 'header',
    gridTemplateColumns: 'repeat(7, 1fr)',
    '& > span': {
      backgroundColor: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      textTransform: 'uppercase',
    },
  },
  monthCalendarControl: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 16,
  },
  iconSmall: {
    fontSize: 16,
  },
  emptyDay: {
    backgroundColor: '#333',
  },
}));

const Calendar = () => {
  const classes = useStyles();
  const today = moment();
  const actualMonthNo = today.startOf('month');
  const [dateMonthView, setDateMonthView] = useState(actualMonthNo);
  const [calendarFourRows, setCalendarFourRows] = useState(false);
  const [calendarSixRows, setCalendarSixRows] = useState(false);
  const [spanLength, setSpanLength] = useState(0);

  const daysInMonth = dateMonthView.daysInMonth();

  const changeMonthView = (direction) => {
    const val =
      direction === 'next'
        ? moment(dateMonthView).clone().add(1, 'month')
        : moment(dateMonthView).clone().subtract(1, 'month');
    setDateMonthView(val);
    const firstDay = parseInt(val.format('d'));
    const spanLengthVal = firstDay === 0 ? 6 : firstDay - 1;
    setSpanLength(spanLengthVal);
    setCalendarFourRows(spanLengthVal + val.daysInMonth() <= 28);
    setCalendarSixRows(spanLengthVal + val.daysInMonth() > 35);
  };

  const generateCalendarSpanStart = () => {
    const firstDay = parseInt(dateMonthView.format('d'));
    if (firstDay === 0) {
      return (
        <>
          <div className={classes.emptyDay} />
          <div className={classes.emptyDay} />
          <div className={classes.emptyDay} />
          <div className={classes.emptyDay} />
          <div className={classes.emptyDay} />
          <div className={classes.emptyDay} />
        </>
      );
    }
    if (firstDay === 1) {
      return;
    }
    if (firstDay === 2) {
      return (
        <>
          <div className={classes.emptyDay} />
        </>
      );
    }
    if (firstDay === 3) {
      return (
        <>
          <div className={classes.emptyDay} />
          <div className={classes.emptyDay} />
        </>
      );
    }
    if (firstDay === 4) {
      return (
        <>
          <div className={classes.emptyDay} />
          <div className={classes.emptyDay} />
          <div className={classes.emptyDay} />
        </>
      );
    }
    if (firstDay === 5) {
      return (
        <>
          <div className={classes.emptyDay} />
          <div className={classes.emptyDay} />
          <div className={classes.emptyDay} />
          <div className={classes.emptyDay} />
        </>
      );
    }
    if (firstDay === 6) {
      return (
        <>
          <div className={classes.emptyDay} />
          <div className={classes.emptyDay} />
          <div className={classes.emptyDay} />
          <div className={classes.emptyDay} />
          <div className={classes.emptyDay} />
        </>
      );
    }
  };

  const generateCalendarSpanEnd = () => {
    const sum = spanLength + daysInMonth;
    let spanEnd = 0;
    if (sum > 28 && sum <= 35) {
      spanEnd = 35 - sum;
    } else if (sum > 35) {
      spanEnd = 42 - sum;
    }
    return [...Array(spanEnd).keys()];
  };

  const generateCalendarDays = () => {
    const monthArray = [];
    for (let i = 0; i < daysInMonth; i++) {
      monthArray.push(i + 1);
    }
    return monthArray;
  };

  const renderCalendarDays = () => {
    return generateCalendarDays().map((day) => <div key={day}>{day}</div>);
  };

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
        <div className={classes.monthCalendarControl}>
          <Typography variant="h5">
            {dateMonthView.format('MMMM YYYY')}
          </Typography>
          <IconButton onClick={() => changeMonthView('prev')}>
            <ArrowBackIos className={classes.iconSmall} />
          </IconButton>
          <IconButton onClick={() => changeMonthView('next')}>
            <ArrowForwardIos className={classes.iconSmall} />
          </IconButton>
        </div>
        <div
          className={clsx(classes.calendar, {
            [classes.calendar4Rows]: calendarFourRows,
            [classes.calendar6Rows]: calendarSixRows,
          })}
        >
          <div className={classes.calendarHeader}>
            <span>Poniedziałek</span>
            <span>Wtorek</span>
            <span>Środa</span>
            <span>Czwartek</span>
            <span>Piątek</span>
            <span>Sobota</span>
            <span>Niedziela</span>
          </div>
          {generateCalendarSpanStart()}
          {renderCalendarDays()}
          {generateCalendarSpanEnd().map((day) => (
            <div key={day} className={classes.emptyDay} />
          ))}
        </div>
        {moment(5, 'DD').format('d, DD-MM-YYYY HH:mm')}
      </Paper>
    </MainWrapper>
  );
};

export default Calendar;
