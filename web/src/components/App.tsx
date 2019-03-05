import React, { useEffect, useState } from 'react';
import './App.css';

const ws = new WebSocket('ws://localhost:8080/');
const urlParams = new URLSearchParams(window.location.search);
const chatId = urlParams.get('chatId');

function App() {
  const [sounds, setSounds] = useState([]);

  useEffect(() => {
    ws.onmessage = ({ data }) => {
      const newSounds = JSON.parse(data);
      setSounds(newSounds);
    };
  }, []);

  const emit = (identifier: string) => () => {
    const message = {
      chatId,
      identifier
    };

    ws.send(JSON.stringify(message));
    //ws.close();
    //window.close();
  };

  return (
    <div className="wrapper">
      {sounds.map(sound => (
        <button onClick={emit(sound)}>{sound}</button>
      ))}
    </div>
  );
}

export default App;
