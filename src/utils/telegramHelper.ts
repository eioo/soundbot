import * as fs from 'fs';
import { Message } from 'node-telegram-bot-api';
import * as path from 'path';
import { bot } from '../bot';
import config from '../config';
import * as Logger from '../utils/logger';
import { convertFileToOpus, deleteFiles } from './ffmpegHelper';

export function extractName(msg: Message) {
  if (!msg.from) {
    return '';
  }

  return `${msg.from.first_name || ''} ${msg.from.last_name || ''}`;
}

export function parseArgs(msg: Message) {
  return (msg.text || '').split(' ').slice(1);
}

export async function getVoiceIdFromAudioId(
  audioId: string,
  chatId: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const download = bot.getFileStream(audioId);
    const filePath = path.join(config.tempPath, audioId);

    Logger.info(`Streaming audio to ${filePath}`);
    const writeStream = fs.createWriteStream(filePath);

    writeStream.on('open', () => {
      const pipe = download.pipe(writeStream);

      pipe.on('finish', async () => {
        Logger.info(`Starting conversion on ${filePath}`);

        const readFileStream = await convertFileToOpus(filePath);
        const fileMessage = await bot.sendVoice(chatId, readFileStream);

        if (!fileMessage.voice) {
          reject(new Error('There was no voice on sent message'));
          return;
        }

        deleteFiles(filePath);
        resolve(fileMessage.voice.file_id);
      });
    });
  });
}
