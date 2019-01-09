import { Message } from 'node-telegram-bot-api';
import { BotResponse, UserActions } from '.';
import { bot, reply } from '../bot';
import {
  addUser,
  clearUserAction,
  deleteSound,
  getAllSounds,
  getAllSoundsFromUser,
  getSound,
  getSoundFromUser,
  setUserAction,
  userExists,
} from '../database';
import { extractName, parseArgs } from '../lib/telegramHelper';

export function commandHandler() {
  bot.onText(/^\/start$/, async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    await reply(msg, BotResponse.Welcome);
  });

  bot.onText(/^\/add(sound)?$/i, async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    if (!(await userExists(msg.from.id))) {
      await addUser(msg.from.id);
    }

    await setUserAction(msg.from.id, UserActions.SendingSound);
    await reply(
      msg,
      `🎶 ${extractName(msg)} please send/record your sound (or /cancel) 🎶`
    );
  });

  bot.onText(/^\/cancel$/i, async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    await clearUserAction(msg.from.id);
    await reply(msg, 'Sure thing bro,');
  });

  bot.onText(/^\/list(all)?$/, async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    const listAll = (msg.text || '').endsWith('all');
    const sounds = listAll
      ? await getAllSounds()
      : await getAllSoundsFromUser(msg.from.id);

    if (!sounds.length) {
      return await reply(msg, BotResponse.NoSoundsYet);
    }

    const response =
      `🎵 ${listAll ? 'All' : 'Your'} sounds:\n` +
      sounds.map(({ identifier }, i) => `${i + 1}. ${identifier}`).join('\n');

    await reply(msg, response);
  });

  bot.onText(/^\/(del(ete)?|remove) \w+$/i, async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    const args = parseArgs(msg);

    if (!args.length) {
      return await reply(msg, BotResponse.NotEnoughArgs);
    }

    const identifier = args.join(' ');
    const sound = await getSoundFromUser(msg.from.id, identifier);

    if (sound) {
      await deleteSound(identifier);
      return await reply(msg, BotResponse.SoundDeleted);
    }

    await reply(msg, BotResponse.SoundNotFound);
  });

  bot.onText(/^\/p(lay)? \w+/i, async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    const args = (msg.text || '').split(' ').slice(1);

    if (!args.length) {
      return await reply(msg, BotResponse.NotEnoughArgs);
    }

    const identifier = args.join(' ');
    const sound = await getSound(identifier);

    if (!sound) {
      return await reply(msg, BotResponse.SoundNotFound);
    }

    if (sound.type === 'audio') {
      return bot.sendAudio(msg.chat.id, sound.file_id);
    }

    if (sound.type === 'voice') {
      return bot.sendVoice(msg.chat.id, sound.file_id);
    }

    await reply(msg, 'call 911 now');
  });
}
