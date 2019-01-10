import { Message } from 'node-telegram-bot-api';
import { botResponses, userActions } from '.';
import { bot, reply } from '../bot';
import {
  addUser,
  clearUserAction,
  deleteSound,
  getAllSounds,
  getAllSoundsFromUser,
  getSound,
  getSoundFromUser,
  searchSounds,
  setUserAction,
  userExists,
} from '../database';
import { decrypt, encrypt } from '../utils/encryption';
import { extractName, parseArgs } from '../utils/telegramHelper';

export function commandHandler() {
  bot.onText(/^\/start$/, async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    await reply(msg, botResponses.welcome);
  });

  bot.onText(/^\/add(sound)?$/i, async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    if (!(await userExists(msg.from.id))) {
      await addUser(msg.from.id);
    }

    await setUserAction(msg.from.id, userActions.sendingSound);
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
      return reply(msg, botResponses.noSoundsYet);
    }

    const response =
      `🎵 *${listAll ? 'All' : 'Your'} sounds*\n` +
      sounds.map(({ identifier }) => `${identifier}`).join('\n');

    await reply(msg, response);
  });

  bot.onText(/^\/(del(ete)?|remove) \w+$/i, async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    const args = parseArgs(msg);

    if (!args.length) {
      return reply(msg, botResponses.notEnoughArgs);
    }

    const identifier = args.join(' ');
    const sound = await getSoundFromUser(msg.from.id, identifier);

    if (sound) {
      await deleteSound(identifier);
      return reply(msg, botResponses.soundDeleted);
    }

    await reply(msg, botResponses.soundNotFound);
  });

  bot.onText(/^\/export$/i, async (msg: Message) => {
    /*
      TODO
    */
    if (!msg.from || msg.from.is_bot || msg.chat.type !== 'private') {
      return;
    }

    const sounds = await getAllSoundsFromUser(msg.from.id);
    const json = JSON.stringify(sounds);
    const encrypted = encrypt(json);

    await reply(msg, encrypted);
  });

  bot.onText(/^\/p(lay)? \w([\w ]+)?/i, async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    const args = (msg.text || '').split(' ').slice(1);

    if (!args.length) {
      return reply(msg, botResponses.notEnoughArgs);
    }

    const identifier = args.join(' ');
    const sounds = await searchSounds(identifier);

    if (!sounds.length) {
      return reply(msg, botResponses.soundNotFound);
    }

    const sound = sounds.find(x => x.identifier === identifier) || sounds[0];

    const canBeSentAsVoice =
      sound.mime_type === 'audio/ogg' && sound.file_size < Math.pow(10, 6);

    if (sound.type === 'voice' || canBeSentAsVoice) {
      return bot.sendVoice(msg.chat.id, sound.file_id);
    }

    if (sound.type === 'audio') {
      return bot.sendAudio(msg.chat.id, sound.file_id);
    }

    await reply(msg, 'call 911 now');
  });
}
