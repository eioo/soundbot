import camelcaseKeys = require('camelcase-keys');
import { Audio, Message } from 'node-telegram-bot-api';
import { botResponses, userActions } from '.';
import { bot, reply } from '../bot';
import { getUserState, setCurrentSound, setUserAction } from '../database';
import { ISound } from '../interfaces/types';
import { extractName } from '../utils/telegramHelper';

export function soundHandler() {
  const listener = async (msg: Message) => {
    const { currentAction, currentChatId } = await getUserState(msg);
    const correctUserState =
      currentAction === userActions.sendingSound ||
      currentChatId === msg.chat.id;

    if (!correctUserState) {
      return;
    }

    if (!msg.voice && !msg.audio) {
      return reply(msg, botResponses.noVoiceOrAudio);
    }

    const fileSize =
      (msg.voice ? msg.voice.file_size : (msg.audio as Audio).file_size) || 0;

    if (fileSize > Math.pow(10, 6)) {
      return reply(msg, 'Too big file');
    }

    const sound = camelcaseKeys(msg.voice || msg.audio) as ISound;
    await setCurrentSound(msg, sound);
    await setUserAction(msg, userActions.writingName);
    reply(
      msg,
      `🤩 Thank you ${extractName(msg)}! What name would you want for it?`
    );
  };

  bot.on('audio', listener);
  bot.on('voice', listener);
}
