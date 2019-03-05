import camelcaseKeys = require('camelcase-keys');
import { Audio, Message } from 'node-telegram-bot-api';
import { botResponses, userActions } from '.';
import { bot, reply } from '../bot';
import { getUserState, setCurrentSound, setUserAction } from '../database';
import { ISound } from '../interfaces/types';
import { createSound, extractName } from '../utils/telegramHelper';

export function soundHandler() {
  const sharedListener = async (msg: Message) => {
    const result = await soundListener(msg);

    if (result) {
      reply(msg, result);
    }
  };

  bot.on('audio', sharedListener);
  bot.on('voice', sharedListener);
}

export async function soundListener(msg: Message) {
  const { currentAction, currentChatId } = await getUserState(msg);
  const correctUserState =
    currentAction === userActions.sendingSound || currentChatId === msg.chat.id;

  if (!correctUserState) {
    return;
  }

  if (!msg.voice && !msg.audio) {
    return botResponses.noVoiceOrAudio;
  }

  const fileSize =
    (msg.voice ? msg.voice.file_size : (msg.audio as Audio).file_size) || 0;

  if (fileSize > Math.pow(10, 6)) {
    return 'Too big file';
  }

  const sound = camelcaseKeys(msg.voice || msg.audio) as ISound;

  if (msg.caption) {
    return createSound(msg, sound.fileId, msg.caption);
  }

  await setCurrentSound(msg, sound);
  await setUserAction(msg, userActions.writingName);

  return `🤩 Thank you ${extractName(msg)}! What name would you want for it?`;
}
