import s from './app.module.less';

import { ipcRenderer } from 'electron';

import React, { useState, useEffect } from 'react';
import { useImmer } from 'use-immer';
import Calendar from 'react-calendar';
import cn from 'classnames';

import { isHoliday, toDay, toTime } from '/src/share/utils/date';
import NoteCard from '/src/components/note-card';

export default function App() {
  const [noteMap, setNoteMap] = useImmer(null);
  const [selectedDate, setDate] = useState(null);
  const [previewDate, setPreviewDate] = useState(toDay(new Date()));
  const [defaultDate, setDefaultDate] = useState(new Date());

  const previewNotes = (noteMap && noteMap[previewDate]) || [];

  useEffect(() => {
    ipcRenderer.send(`request-all-notes`);

    ipcRenderer.on(`all-notes`, (ev, data) => {
      console.log(`all notes`, data);
      setNoteMap(() => data);
    });
  }, [selectedDate]);

  const onClickDay = (value) => {
    const date = toDay(value);
    if (date !== previewDate) {
      setPreviewDate(date);
      return;
    }

    setDate(date);
  };

  const onCancel = () => {
    setDate(null);
    // setPreviewDate(null);
  };

  const onActiveStartDateChange = ({ activeStartDate }) => {
    setDefaultDate(activeStartDate);
  };

  const deleteNote = (i) => () => {
    const { date, $$id, title } = i;
    setNoteMap((draft) => {
      draft[date] = draft[date].filter((i) => i.$$id !== $$id);
    });

    ipcRenderer.send(`delete-note`, $$id);
    new Notification(`🌚 Deleted`, {
      body: title.length > 10 ? title.substring(0, 10) + `...` : title,
    });
  };

  if (!noteMap) {
    return <div>loading...</div>;
  }

  return selectedDate ? (
    <NoteCard date={selectedDate} onCancel={onCancel} />
  ) : (
    <>
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
      {previewNotes.length > 0 && (
        <div className={s.noteList}>
          <h4>Notes on {previewDate}</h4>
          <ul>
            {previewNotes.map((i, idx) => {
              return (
                <li key={idx} title={i.title}>
                  <span>
                    {i.title.substring(0, 10)}
                    {i.title.length > 10 && `...`}
                  </span>
                  <span className={s.time}>{i.createdAt && toTime(i.createdAt)}</span>
                  <span className={s.delete} title={`Delete`} onClick={deleteNote(i)}>
                    ❌
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </>
  );
}
