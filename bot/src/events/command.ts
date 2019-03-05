import * as fuzzysort from 'fuzzysort';
import { Message } from 'node-telegram-bot-api';
import { botResponses, userActions } from '.';
import { bot, reply, replyWithVoice } from '../bot';
import {
  clearUserAction,
  deleteSoundFromUser,
  getAllSounds,
  getAllSoundsFromUser,
  getSoundFromUser,
  setUserAction,
} from '../database';
import { IPlayCommandResponse } from '../interfaces/types';
import { extractName, parseArgs } from '../utils/telegramHelper';
import config from '../config';

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

  bot.onText(/^\/list(all)?$/, async (msg: Message) => {
    const response = await listListener(msg);
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

  bot.onText(/^\/link$/i, async (msg: Message) => {
    const url = `${config.webUrl}?chatId=${msg.chat.id}`;

    reply(msg, `${url}`);
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

export async function listListener(msg: Message): Promise<string> {
  const listAll = (msg.text || '').endsWith('all');
  const sounds = listAll
    ? await getAllSounds()
    : await getAllSoundsFromUser(msg);

  if (!sounds.length) {
    return botResponses.noSoundsYet;
  }

  const response =
    `🎵 *${listAll ? 'All' : 'Your'} sounds*\n` +
    sounds.map(({ identifier }) => `${identifier}`).join('\n');

  return response;
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
