import s from './style.module.less';

import { ipcRenderer } from 'electron';
import React, { useState } from 'react';

export default function NoteCard({ date, onCancel }) {
  const [title, setTitle] = useState(date);
  const [content, setContent] = useState(``);

  const onSave = () => {
    if (!title) return;

    ipcRenderer.send(`create-note`, { date, title, content });
  };

  return (
    <div className={s.container}>
      <h3>{date}</h3>
      <input type='text' value={title} onChange={(ev) => setTitle(ev.target.value)} />
      <textarea value={content} onChange={(ev) => setContent(ev.target.value)} />
      <div className={s.btns}>
        <button onClick={onCancel}>Cancel</button>
        <button onClick={onSave}>Save</button>
      </div>
    </div>
  );
}
