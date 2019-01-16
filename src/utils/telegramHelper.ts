import * as fs from 'fs';
import { Message, User } from 'node-telegram-bot-api';
import * as path from 'path';
import { performance } from 'perf_hooks';
import { bot, reply } from '../bot';
import config from '../config';
import { addSound, clearUserAction } from '../database';
import * as Logger from '../utils/logger';
import { convertFileToOpus, deleteFiles } from './ffmpegHelper';

export function extractName(msg: Message) {
  const user = msg.from as User;
  return `${user.first_name || ''} ${user.last_name || ''}`.trim();
}

export function parseArgs(msg: Message) {
  return (msg.text || '').split(' ').slice(1);
}

export async function createSound(
  msg: Message,
  fileId: string,
  identifier: string
) {
  const voiceId = await getVoiceIdFromAudioId(fileId, msg.chat.id);

  await addSound(msg, {
    fileId: voiceId,
    identifier,
  });

  await clearUserAction(msg);

  await reply(
    msg,
    `🥳 ${extractName(
      msg
    )}, your sound was added.\n/list to see your sounds\n/listall to see all sounds`
  );
}
export async function getVoiceIdFromAudioId(
  audioId: string,
  chatId: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    Logger.info(`Beginning pipeline for ${audioId}`);
    const t1 = performance.now();

    const download = bot.getFileStream(audioId);
    const filePath = path.join(config.tempPath, audioId);

    Logger.info(`-> Streaming audio to ${filePath}`);
    const writeStream = fs.createWriteStream(filePath);

    writeStream.on('open', () => {
      const pipe = download.pipe(writeStream);

      pipe.on('finish', async () => {
        Logger.info(`-> Starting conversion on ${filePath}`);

        const readFileStream = await convertFileToOpus(filePath);
        const fileMessage = await bot.sendVoice(chatId, readFileStream);

        if (!fileMessage.voice) {
          reject(new Error('There was no voice on sent message'));
          return;
        }

        deleteFiles(filePath);

        const t2 = performance.now();
        Logger.info(`Ended pipeline for ${audioId} in ${t2 - t1} ms`);

        resolve(fileMessage.voice.file_id);
      });
    });
  });
}
