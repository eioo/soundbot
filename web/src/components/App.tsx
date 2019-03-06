import React, { useState } from 'react';
import './App.css';

import config from '../config';
import * as chatTokenUtil from '../utils/chatToken';

const ws = new WebSocket(`ws://${config.socketHost}:${config.socketPort}`);
const chatToken = chatTokenUtil.getChatToken();

function App() {
  if (!chatToken) {
    return <div>go away</div>;
  }

  const [sounds, setSounds] = useState<string[]>([]);

  if (!ws.onmessage) {
    ws.onmessage = ({ data }) => {
      const newSounds = JSON.parse(data);
      setSounds(newSounds);
    };
  }

  const emit = (identifier: string) => () => {
    const message = {
      chatToken,
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
