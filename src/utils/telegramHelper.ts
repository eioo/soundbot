import * as fs from 'fs';
import { Message, User } from 'node-telegram-bot-api';
import * as path from 'path';
import { performance } from 'perf_hooks';
import { bot, reply } from '../bot';
import config from '../config';
import { addSound, clearUserAction } from '../database';
import * as Logger from '../utils/logger';
import { convertFileToOpus, deleteFiles } from './ffmpegHelper';
import { areWeTestingWithJest } from './jestCheck';

export function extractName(msg: Message) {
  const user = msg.from as User;
  return `${user.first_name || ''} ${user.last_name || ''}`.trim();
}

export function parseArgs(msg: Message) {
  return (msg.text || '').split(' ').slice(1);
}

interface IConvertedVoice {
  stream: fs.ReadStream;
  filePath: string;
}

export async function createSound(
  msg: Message,
  fileId: string,
  identifier: string
): Promise<string> {
  const voice = await getVoiceFromAudioId(fileId);
  const fileMessage = await bot.sendVoice(msg.chat.id, voice.stream, {
    disable_notification: true,
  });

  if (areWeTestingWithJest()) {
    await bot.deleteMessage(msg.chat.id, fileMessage.message_id.toString());
  }

  deleteFiles(voice.filePath);

  if (!fileMessage.voice) {
    throw new Error('There was no voice on sent message');
  }

  const voiceId = fileMessage.voice.file_id;

  await addSound(msg, {
    fileId: voiceId,
    identifier,
  });
  await clearUserAction(msg);

  return `🥳 ${extractName(
    msg
  )}, your sound was added.\n/list to see your sounds\n/listall to see all sounds`;
}

export async function getVoiceFromAudioId(
  audioId: string
): Promise<IConvertedVoice> {
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
        const t2 = performance.now();
        Logger.info(`Ended pipeline for ${audioId} in ${t2 - t1} ms`);

        resolve({
          stream: readFileStream,
          filePath,
        });
      });
    });
  });
}
