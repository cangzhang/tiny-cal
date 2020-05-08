import s from './app.module.less';

import { ipcRenderer } from 'electron';

import React, { useState, useEffect } from 'react';
import cn from 'classnames';
import Calendar from 'react-calendar';

import { isHoliday, toDay } from '/src/share/utils/date';
import NoteCard from '/src/components/note-card';

export default function App() {
  const [noteMap, setNoteMap] = useState(null);
  const [selectedDate, setDate] = useState(null);
  const [defaultDate, setDefaultDate] = useState(new Date());

  useEffect(() => {
    ipcRenderer.send(`request-all-notes`);

    ipcRenderer.on(`all-notes`, (ev, data) => {
      console.log(data);
      setNoteMap(data);
    });
  }, []);

  const onClickDay = (value) => {
    const date = toDay(value);
    setDate(date);
  };

  const onCancel = () => {
    setDate(null);
  };

  const onActiveStartDateChange = ({ activeStartDate }) => {
    setDefaultDate(activeStartDate);
  };

  if (!noteMap) {
    return <div>loading...</div>;
  }

  return selectedDate ? (
    <NoteCard date={selectedDate} onCancel={onCancel} />
  ) : (
    <Calendar
      className={s.calendar}
      calendarType={`US`}
      tileClassName={({ date, view }) => {
        const [dayOff] = isHoliday(date);
        const day = toDay(date);
        const hasNotes = (noteMap[day] || []).length > 0;

        return cn(s.date, view === `month` && dayOff && s.holiday, hasNotes && s.hasNotes);
      }}
      tileContent={({ date, view }) => {
        const [dayOff, name] = isHoliday(date);
        return view === `month` && dayOff ? <div className={s.name}>{name}</div> : null;
      }}
      onClickDay={onClickDay}
      defaultActiveStartDate={defaultDate}
      onActiveStartDateChange={onActiveStartDateChange}
    />
  );
}
