import * as fuzzysort from 'fuzzysort';
import { Message } from 'node-telegram-bot-api';

import { bot, reply, replyWithVoice } from '../bot';
import config from '../config';
import {
  clearUserAction,
  deleteSoundFromUser,
  getAllSounds,
  getSoundFromUser,
  setUserAction,
} from '../database';
import { IPlayCommandResponse } from '../interfaces/types';
import { extractName, parseArgs } from '../utils/telegramHelper';
import { botResponses, userActions } from './';

export function commandHandler() {
  bot.onText(/^\/start$/, async (msg: Message) => {
    const response = await startListener();
    reply(msg, response);
  });

  bot.onText(/^\/add(sound)?$/i, async (msg: Message) => {
    const response = await addListener(msg);
    reply(msg, response);
  });

  bot.onText(/^\/cancel$/i, async (msg: Message) => {
    const response = await cancelListener(msg);
    reply(msg, response);
  });

  bot.onText(/^\/(del(ete)?|remove) .+$/i, async (msg: Message) => {
    const response = await deleteListener(msg);
    reply(msg, response);
  });

  bot.onText(/^\/p(lay)? \w([\w ]+)?/i, async (msg: Message) => {
    const { text, fileId } = await playListener(msg);

    if (text) {
      return reply(msg, text);
    }

    if (fileId) {
      replyWithVoice(msg, fileId);
    }
  });

  bot.onText(/^\/sounds?$/i, async (msg: Message) => {
    const url = `http://${config.webHost}:${config.webPort}/?chatId=${
      msg.chat.id
    }`;
    const replyMessage = await reply(msg, `[Selaa ääniä 🔊](${url})`);

    setTimeout(() => {
      if (!replyMessage) {
        return;
      }

      bot.deleteMessage(msg.chat.id, `${replyMessage.message_id}`);
    }, 30 * 1000);
  });
}

export async function startListener() {
  return botResponses.welcome;
}

export async function addListener(msg: Message): Promise<string> {
  await setUserAction(msg, userActions.sendingSound);
  return `🎶 ${extractName(msg)} please send/record your sound (or /cancel) 🎶`;
}

export async function cancelListener(msg: Message): Promise<string> {
  await clearUserAction(msg);
  return botResponses.cancel;
}

export async function deleteListener(msg: Message): Promise<string> {
  const args = parseArgs(msg);

  if (!args.length) {
    return botResponses.notEnoughArgs;
  }

  const identifier = args.join(' ');
  const sound = await getSoundFromUser(msg, identifier);

  if (sound) {
    await deleteSoundFromUser(msg, identifier);
    return botResponses.soundDeleted;
  }

  return botResponses.soundNotFound;
}

export async function playListener(
  msg: Message
): Promise<IPlayCommandResponse> {
  const args = (msg.text || '').split(' ').slice(1);

  if (!args.length) {
    return {
      text: botResponses.notEnoughArgs,
    };
  }

  const userInput = args.join(' ');
  const allSounds = await getAllSounds();
  const results = fuzzysort.go(userInput, allSounds, {
    key: 'identifier',
    limit: 1,
  });

  if (!results.length) {
    return {
      text: botResponses.soundNotFound,
    };
  }

  const { fileId } = results[0].obj;
  return {
    fileId,
  };
}
