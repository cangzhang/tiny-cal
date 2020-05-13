import s from './style.module.less';

import { nanoid as uuid } from 'nanoid';
import { ipcRenderer } from 'electron';
import React, { useState } from 'react';

export default function NoteCard({ date, onCancel }) {
  const [title, setTitle] = useState(``);

  const onSave = () => {
    if (!title) return;

    ipcRenderer.send(`create-note`, { date, title, $$id: uuid() });
    new Notification(`🌝 Saved`, {
      body: title.length > 10 ? title.substring(0, 10) + `...` : title,
    });
  };

  return (
    <div className={s.container}>
      <h3>{date}</h3>
      <textarea
        value={title}
        placeholder={`Input something for ${date}.`}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <div className={s.btns}>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onSave}>Save</button>
      </div>
    </div>
  );
}
