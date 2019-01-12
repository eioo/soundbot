import { exec as asyncExec } from 'child_process';
import * as fs from 'fs';
import { Message, User } from 'node-telegram-bot-api';
import * as path from 'path';
import * as util from 'util';
import { botResponses, userActions } from '.';
import { bot, reply } from '../bot';
import config from '../config';
import {
  addSound,
  clearUserAction,
  getLastSound,
  getSoundFromUser,
  getUserAction,
} from '../database';
import * as Logger from '../utils/logger';
import { extractName } from '../utils/telegramHelper';

const exec = util.promisify(asyncExec);

async function convertFile(filePath: string) {
  await exec(`ffmpeg -i "${filePath}" -c:a libopus "${filePath}.opus"`);

  return fs.createReadStream(filePath);
}

function deleteFiles(filePath: string) {
  fs.unlink(filePath, err => {
    if (err) {
      Logger.error(err);
    }
  });

  fs.unlink(`${filePath}.opus`, err => {
    if (err) {
      Logger.error(err);
    }
  });
}

export function messageHandler() {
  bot.on('message', async (msg: Message) => {
    Logger.message(`\n`, msg);

    if (!msg.from || !msg.text || msg.text.startsWith('/')) {
      return;
    }

    const currentAction = await getUserAction(msg.from.id);

    if (currentAction !== userActions.writingName) {
      return;
    }

    const identifier = msg.text.toLowerCase();

    if (!identifier) {
      return reply(msg, botResponses.invalidIdentifier);
    }

    const soundExists = await getSoundFromUser(msg.from.id, identifier);

    if (soundExists) {
      return reply(msg, botResponses.identifierExists);
    }

    const lastSound = await getLastSound(msg.from.id);
    const filePath = path.join(config.tempPath, lastSound.fileId);
    const download = bot.getFileStream(lastSound.fileId);

    Logger.info(`Streaming audio to ${filePath}`);

    const writeStream = fs.createWriteStream(filePath);

    writeStream.on('open', () => {
      const pipe = download.pipe(writeStream);

      pipe.on('finish', async () => {
        Logger.info(`Starting conversion on ${filePath}`);

        const readFileStream = await convertFile(filePath);
        const fileMessage = await bot.sendVoice(msg.chat.id, readFileStream);

        if (!fileMessage.voice) {
          throw new Error('There was no voice on sent message');
        }

        Logger.info(`Finished conversion on ${filePath}`);
        deleteFiles(filePath);

        await addSound((msg.from as User).id, {
          fileId: fileMessage.voice.file_id,
          identifier,
        });

        await clearUserAction((msg.from as User).id);

        await reply(
          msg,
          `🥳 ${extractName(
            msg
          )}, your sound was added.\n/list to see your sounds\n/listall to see all sounds`
        );
      });
    });
  });
}
