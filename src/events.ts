import { Message } from 'node-telegram-bot-api';
import { bot, reply } from './bot';
import {
  addSound,
  addUser,
  clearUserAction,
  getAllSoundsFromUser,
  getLastSound,
  getSoundFromUser,
  getUserAction,
  setCurrentSound,
  setUserAction,
  userExists,
} from './database';
import { extractName } from './lib/telegramHelper';
import { ISound } from './lib/types';

enum UserActions {
  SendingSound = 'sending sound',
  WritingName = 'writing name',
}

enum InteractionError {
  Action = '🤔 Something went wrong, try again or type /cancel',
  NotEnoughArgs = '🤔 I need more arguments than that',
  SoundNotFound = '🤔 You don\'t have sound with that name',
  IdentifierExists = '🤦🏻‍♂️ Pick another name, that\'s already taken.',
  NoSoundsYet = '😰 You don\'t have any sound! Type /add to make your first',
}

const welcomeMessage = 'Hello! Type /add to add your own sound';

export function eventHandler() {
  commandHandler();
  messageHandler();
  soundHandler();
}

function commandHandler() {
  bot.onText(/^\/start$/, async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    reply(msg, welcomeMessage);
  });

  bot.onText(/^\/add(sound)?$/i, async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    if (!(await userExists(msg.from.id))) {
      await addUser(msg.from.id);
    }

    await setUserAction(msg.from.id, UserActions.SendingSound);
    reply(
      msg,
      `🎶 ${extractName(msg)} please send/record your sound (or /cancel) 🎶`
    );
  });

  bot.onText(/^\/cancel$/i, async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    clearUserAction(msg.from.id);
    await reply(msg, 'Cancelled sending sound');
  });

  bot.onText(/^\/list$/, async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    const sounds = await getAllSoundsFromUser(msg.from.id);

    if (!sounds.length) {
      return await reply(msg, InteractionError.NoSoundsYet);
    }

    const response =
      '🎵 All sounds:\n' +
      sounds
        .map((sound, i) => {
          return `${i + 1}. ${sound.identifier}`;
        })
        .join('\n');

    await reply(msg, response);
  });

  bot.onText(/^\/p(lay)? \w+/i, async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    const args = (msg.text || '').split(' ').slice(1);

    if (!args.length) {
      return await reply(msg, InteractionError.NotEnoughArgs);
    }

    const identifier = args.join(' ');
    const sound = await getSoundFromUser(msg.from.id, identifier);

    if (!sound) {
      return await reply(msg, InteractionError.SoundNotFound);
    }

    if (sound.type === 'audio') {
      return bot.sendAudio(msg.chat.id, sound.file_id, {
        title: 'test',
        caption: 'perse',
      });
    }

    if (sound.type === 'voice') {
      return bot.sendVoice(msg.chat.id, sound.file_id);
    }

    await reply(msg, 'call 911 now');
  });
}

function messageHandler() {
  bot.on('message', async (msg: Message) => {
    if (!msg.from || msg.from.is_bot || !msg.text) {
      return;
    }

    const currentAction = await getUserAction(msg.from.id);

    if (currentAction !== UserActions.WritingName) {
      return;
    }

    const lastSound = await getLastSound(msg.from.id);
    const identifier = msg.text.toLowerCase();

    if (!identifier || identifier.startsWith('/')) {
      return await reply(msg, InteractionError.Action);
    }

    const soundExists = await getSoundFromUser(msg.from.id, identifier);

    if (soundExists) {
      return await reply(msg, InteractionError.IdentifierExists);
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

function soundHandler() {
  const listener = async (msg: Message) => {
    if (!msg.from || msg.from.is_bot) {
      return;
    }

    const currentAction = await getUserAction(msg.from.id);

    if (currentAction !== UserActions.SendingSound) {
      return;
    }

    if (!msg.voice && !msg.audio) {
      return await reply(msg, InteractionError.Action);
    }

    const sound = (msg.voice || msg.audio) as ISound;

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
