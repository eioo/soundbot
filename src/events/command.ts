import * as levenshtein from 'js-levenshtein';
import { Message } from 'node-telegram-bot-api';
import { botResponses, userActions } from '.';
import { bot, reply } from '../bot';
import {
  addUser,
  clearUserAction,
  deleteSoundFromUser,
  getAllSounds,
  getAllSoundsFromUser,
  getSoundFromUser,
  setUserAction,
  userExists,
} from '../database';
import { extractName, parseArgs } from '../utils/telegramHelper';

export function commandHandler() {
  bot.onText(/^\/start$/, async (msg: Message) => {
    await reply(msg, botResponses.welcome);
  });

  bot.onText(/^\/add(sound)?$/i, async (msg: Message) => {
    if (!(await userExists(msg))) {
      await addUser(msg);
    }

    await setUserAction(msg, userActions.sendingSound);
    await reply(
      msg,
      `🎶 ${extractName(msg)} please send/record your sound (or /cancel) 🎶`
    );
  });

  bot.onText(/^\/cancel$/i, async (msg: Message) => {
    await clearUserAction(msg);
    await reply(msg, botResponses.cancel);
  });

  bot.onText(/^\/list(all)?$/, async (msg: Message) => {
    const listAll = (msg.text || '').endsWith('all');
    const sounds = listAll
      ? await getAllSounds()
      : await getAllSoundsFromUser(msg);

    if (!sounds.length) {
      return reply(msg, botResponses.noSoundsYet);
    }

    const response =
      `🎵 *${listAll ? 'All' : 'Your'} sounds*\n` +
      sounds.map(({ identifier }) => `${identifier}`).join('\n');

    await reply(msg, response);
  });

  bot.onText(/^\/(del(ete)?|remove) .+$/i, async (msg: Message) => {
    const args = parseArgs(msg);

    if (!args.length) {
      return reply(msg, botResponses.notEnoughArgs);
    }

    const identifier = args.join(' ');
    const sound = await getSoundFromUser(msg, identifier);

    if (sound) {
      await deleteSoundFromUser(msg, identifier);
      return reply(msg, botResponses.soundDeleted);
    }

    await reply(msg, botResponses.soundNotFound);
  });

  bot.onText(/^\/p(lay)? \w([\w ]+)?/i, async (msg: Message) => {
    const args = (msg.text || '').split(' ').slice(1);

    if (!args.length) {
      return reply(msg, botResponses.notEnoughArgs);
    }

    const userInput = args.join(' ');
    const allSounds = await getAllSounds();

    const allSoundsWithLevenshtein = allSounds
      .map(({ identifier, ...rest }) => ({
        identifier,
        ...rest,
        distance: levenshtein(identifier, userInput),
      }))
      .sort((a, b) => b.distance - a.distance);

    if (allSoundsWithLevenshtein.length === 0) {
      return reply(msg, botResponses.soundNotFound);
    }

    const sound = allSoundsWithLevenshtein[0];

    return bot.sendVoice(msg.chat.id, sound.fileId);
  });
}
