import * as numberMinify from 'number-minify';
import * as WebSocket from 'ws';

import { bot } from '../bot';
import config from '../config';
import { getAllSounds } from '../database';

interface IPlaySoundData {
  chatToken: string;
  identifier: string;
}

export function startWebsocket() {
  const wss = new WebSocket.Server({ port: config.socketPort });

  wss.on('connection', async ws => {
    const allSounds = await getAllSounds();
    const identifiers = allSounds.map(sound => sound.identifier);

    ws.send(JSON.stringify(identifiers));

    ws.on('message', message => {
      const data: IPlaySoundData = JSON.parse(message.toString());
      const { chatToken, identifier } = data;
      const chatId = numberMinify.decode(chatToken.replace('G', '-'), {
        characters:
          '0123456789ABCDEFHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
        useNegativePrefix: true,
      });

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
