import s from './app.less';

import React from 'react';
import cn from 'classnames';
import Calendar from 'react-calendar';

import { isHoliday } from './share/utils/day';

export default function App() {
  return (
    <Calendar
      className={s.calendar}
      calendarType={`US`}
      tileClassName={({ date, view }) => {
        const [dayOff] = isHoliday(date);
        return view === `month` && dayOff ? cn(s.holiday, s.date) : s.date;
      }}
      tileContent={({ date }) => {
        const [, name] = isHoliday(date);
        return name ? <div className={s.name}>{name}</div> : null;
      }}
    />
  );
}
