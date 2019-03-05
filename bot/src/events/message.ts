import { Message } from 'node-telegram-bot-api';
import { botResponses, userActions } from '.';
import { bot, reply } from '../bot';
import { getLastSound, getSoundFromUser, getUserState } from '../database';
import * as Logger from '../utils/logger';
import { createSound } from '../utils/telegramHelper';

export function messageHandler() {
  bot.on('message', async (msg: Message) => {
    const result = await messageListener(msg);

    if (result) {
      reply(msg, result);
    }
  });
}

export async function messageListener(msg: Message) {
  Logger.message(`\n`, msg);

  if (!msg.text || msg.text.startsWith('/')) {
    return;
  }

  const { currentAction, currentChatId } = await getUserState(msg);
  const correctUserState =
    currentAction === userActions.writingName && currentChatId === msg.chat.id;

  if (!correctUserState) {
    return;
  }

  const identifier = msg.text.toLowerCase();

  if (!identifier) {
    return botResponses.invalidIdentifier;
  }

  const soundExists = await getSoundFromUser(msg, identifier);

  if (soundExists) {
    return botResponses.identifierExists;
  }

  const lastSound = await getLastSound(msg);
  const result = await createSound(msg, lastSound.fileId, identifier);

  return result;
}
