import { Message } from 'node-telegram-bot-api';
import { botResponses, userActions } from '.';
import { bot, reply } from '../bot';
import {
  addSound,
  clearUserAction,
  getUserAction,
  setCurrentSound,
  setUserAction,
} from '../database';
import { ISound } from '../interfaces/types';
import { extractName } from '../utils/telegramHelper';

export function soundHandler() {
  const listener = async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    const currentAction = await getUserAction(msg.from.id);

    if (currentAction !== userActions.sendingSound) {
      return;
    }

    if (!msg.voice && !msg.audio) {
      return reply(msg, botResponses.noVoiceOrAudio);
    }

    const sound = (msg.voice || msg.audio) as ISound;

    if (msg.caption && /\w[\w ]+/.test(msg.caption)) {
      await addSound(msg.from.id, {
        type: 'audio',
        identifier: msg.caption,
        ...sound,
      });
      await clearUserAction(msg.from.id);
      await reply(
        msg,
        `🥳 ${extractName(msg)}, your sound was added. Type /list to see sounds`
      );

      return;
    }

    await setCurrentSound(msg.from.id, {
      type: msg.audio ? 'audio' : 'voice',
      ...sound,
    });
    await setUserAction(msg.from.id, userActions.writingName);
    await reply(
      msg,
      `🤩 Thank you ${extractName(msg)}! What name would you want for it?`
    );
  };

  bot.on('audio', listener);
  bot.on('voice', listener);
}
