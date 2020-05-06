import { ipcRenderer } from 'electron';

import React from 'react';

export default function Root() {
  const send = () => {
    ipcRenderer.send(`log-msg`, {
      value: 123,
    })
  }

  return (
    <div>
      TinyCal
      <button onClick={send}>send</button>
    </div>
  )
}
