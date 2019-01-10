import { Message } from 'node-telegram-bot-api';
import { botResponses, userActions } from '.';
import { bot, reply } from '../bot';
import {
  addSound,
  clearUserAction,
  getLastSound,
  getSoundFromUser,
  getUserAction,
} from '../database';
import { extractName } from '../utils/telegramHelper';

export function messageHandler() {
  bot.on('message', async (msg: Message) => {
    console.log(msg);
    if (!msg.from || msg.from.is_bot || !msg.text) {
      return;
    }

    const currentAction = await getUserAction(msg.from.id);

    if (currentAction !== userActions.writingName) {
      return;
    }

    const lastSound = await getLastSound(msg.from.id);
    const identifier = msg.text.toLowerCase();

    if (!identifier || identifier.startsWith('/')) {
      return reply(msg, botResponses.invalidIdentifier);
    }

    const soundExists = await getSoundFromUser(msg.from.id, identifier);

    if (soundExists) {
      return reply(msg, botResponses.identifierExists);
    }

    await addSound(msg.from.id, {
      ...lastSound,
      identifier,
    });

    await clearUserAction(msg.from.id);
    await reply(
      msg,
      `🥳 ${extractName(msg)}, your sound was added. Type /list to see sounds`
    );
  });
}
