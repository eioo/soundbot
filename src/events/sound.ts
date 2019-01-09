import { Message } from 'node-telegram-bot-api';
import { BotResponse, UserActions } from '.';
import { bot, reply } from '../bot';
import {
  addSound,
  clearUserAction,
  getUserAction,
  setCurrentSound,
  setUserAction,
} from '../database';
import { extractName } from '../lib/telegramHelper';
import { ISound } from '../lib/types';

export function soundHandler() {
  const listener = async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    const currentAction = await getUserAction(msg.from.id);

    if (currentAction !== UserActions.SendingSound) {
      return;
    }

    if (!msg.voice && !msg.audio) {
      return await reply(msg, BotResponse.Action);
    }

    const sound = (msg.voice || msg.audio) as ISound;

    if (msg.caption) {
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
    await setUserAction(msg.from.id, UserActions.WritingName);
    await reply(
      msg,
      `🤩 Thank you ${extractName(msg)}! What name would you want for it?`
    );
  };

  bot.on('audio', listener);
  bot.on('voice', listener);
}
