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

export function commandHandler() {
  bot.onText(/^\/start$/, async (msg: Message) => {
    const response = await startHandler();
    reply(msg, response);
  });

  bot.onText(/^\/add(sound)?$/i, async (msg: Message) => {
    const response = await addHandler(msg);
    reply(msg, response);
  });

  bot.onText(/^\/cancel$/i, async (msg: Message) => {
    const response = await cancelHandler(msg);
    reply(msg, response);
  });

  bot.onText(/^\/list(all)?$/, async (msg: Message) => {
    const response = await listHandler(msg);
    reply(msg, response);
  });

  bot.onText(/^\/(del(ete)?|remove) .+$/i, async (msg: Message) => {
    const response = await deleteHandler(msg);
    reply(msg, response);
  });

  bot.onText(/^\/p(lay)? \w([\w ]+)?/i, async (msg: Message) => {
    const { text, fileId } = await playHandler(msg);

    if (text) {
      return reply(msg, text);
    }

    if (fileId) {
      replyWithVoice(msg, fileId);
    }
  });
}

async function startHandler() {
  return botResponses.welcome;
}

async function addHandler(msg: Message): Promise<string> {
  await setUserAction(msg, userActions.sendingSound);
  return `🎶 ${extractName(msg)} please send/record your sound (or /cancel) 🎶`;
}

async function cancelHandler(msg: Message): Promise<string> {
  await clearUserAction(msg);
  return botResponses.cancel;
}

async function deleteHandler(msg: Message): Promise<string> {
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

async function listHandler(msg: Message): Promise<string> {
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

async function playHandler(msg: Message): Promise<IPlayCommandResponse> {
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
