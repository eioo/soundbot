import React, { useState } from 'react';
import './App.css';

import config from '../config';

const ws = new WebSocket(`ws://${config.socketHost}:${config.socketPort}`);
const urlParams = new URLSearchParams(window.location.search);
const chatId = Number(urlParams.get('chatId'));

function App() {
  console.log(config);

  if (!chatId) {
    return <div>go away</div>;
  }

  const [sounds, setSounds] = useState<string[]>([]);

  ws.onmessage = ({ data }) => {
    const newSounds = JSON.parse(data);
    setSounds(newSounds);
  };

  const emit = (identifier: string) => () => {
    const message = {
      chatId,
      identifier
    };

    ws.send(JSON.stringify(message));
  };

  return (
    <div className="wrapper">
      {sounds.map(sound => (
        <button key={sound} onClick={emit(sound)}>
          {sound}
        </button>
      ))}
    </div>
  );
}

export default App;
