import { Message } from 'node-telegram-bot-api';
import { botResponses, userActions } from '.';
import { bot, reply } from '../bot';
import {
  addSound,
  clearUserAction,
  getLastSound,
  getSoundFromUser,
  getUserState,
} from '../database';
import * as Logger from '../utils/logger';
import { extractName, getVoiceIdFromAudioId } from '../utils/telegramHelper';

export function messageHandler() {
  bot.on('message', async (msg: Message) => {
    Logger.message(`\n`, msg);

    if (!msg.text || msg.text.startsWith('/')) {
      return;
    }

    const { currentAction, currentChatId } = await getUserState(msg);
    const correctUserState =
      currentAction === userActions.writingName &&
      currentChatId === msg.chat.id;

    if (!correctUserState) {
      return;
    }

    const identifier = msg.text.toLowerCase();

    if (!identifier) {
      return reply(msg, botResponses.invalidIdentifier);
    }

    const soundExists = await getSoundFromUser(msg, identifier);

    if (soundExists) {
      return reply(msg, botResponses.identifierExists);
    }

    const lastSound = await getLastSound(msg);
    const voiceId = await getVoiceIdFromAudioId(lastSound.fileId, msg.chat.id);

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
  });
}
