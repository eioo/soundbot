import * as TelegramBot from 'node-telegram-bot-api';
import config from '../config';

interface IUpdateOptions {
  userId?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  isBot?: boolean;
  type?: TelegramBot.ChatType;
  date?: Date;
  text?: string;
  audio?: TelegramBot.Audio;
  voice?: TelegramBot.Voice;
}

const defaults = {
  firstName: 'TestFirstName',
  lastName: 'TestLastName',
  username: 'testuser',
  type: 'private',
  isBot: false,
  testChatId: config.testChatId,
};

let messageId = 1000;

export function createMessage(
  options: IUpdateOptions = {}
): TelegramBot.Message {
  messageId++;

  const from: TelegramBot.User = {
    id: options.userId || 1,
    first_name: options.firstName || defaults.firstName,
    last_name: options.lastName || defaults.lastName,
    username: options.username || defaults.username,
    is_bot: options.isBot || defaults.isBot,
  };

  const chat: TelegramBot.Chat = {
    id: defaults.testChatId,
    first_name: options.firstName || defaults.firstName,
    last_name: options.lastName || defaults.lastName,
    username: options.username || defaults.username,
    type: options.type || (defaults.type as TelegramBot.ChatType),
  };

  const date = Math.floor(Date.now() / 1000);
  const message: TelegramBot.Message = {
    message_id: messageId,
    from,
    chat,
    date,
  };

  if (options.text) {
    message.text = options.text;
  }

  if (options.audio) {
    message.audio = options.audio;
  }

  return message;
}
