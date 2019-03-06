import React, { useEffect, useState } from 'react';
import config from '../config';
import './App.css';

const ws = new WebSocket(`ws://${config.socketHost}:${config.socketPort}`);
const urlParams = new URLSearchParams(window.location.search);
const chatId = Number(urlParams.get('chatId'));

if (!chatId) {
  window.close();
}

function App() {
  const [sounds, setSounds] = useState<string[]>([]);

  useEffect(() => {
    ws.onmessage = ({ data }) => {
      const newSounds = JSON.parse(data);
      setSounds(newSounds);
    };
  });

  const emit = (identifier: string) => () => {
    const message = {
      chatId,
      identifier
    };

    ws.send(JSON.stringify(message));
    ws.close();
    window.close();
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
