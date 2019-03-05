import * as WebSocket from 'ws';

import { bot } from '../bot';
import config from '../config';
import { getAllSounds } from '../database';

export function startWebsocket() {
  const wss = new WebSocket.Server({ port: config.socketPort });

  wss.on('connection', async ws => {
    const allSounds = await getAllSounds();
    const identifiers = allSounds.map(sound => sound.identifier);

    ws.send(JSON.stringify(identifiers));

    ws.on('message', message => {
      const { chatId, identifier } = JSON.parse(message.toString());

      const foundFile = allSounds.find(
        sound => sound.identifier === identifier
      );

      if (!foundFile) {
        return;
      }

      bot.sendVoice(chatId, foundFile.fileId, {
        disable_notification: true,
      });
    });
  });
}
