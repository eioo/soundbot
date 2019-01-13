import * as fs from 'fs';
import * as TelegramBot from 'node-telegram-bot-api';
import config from './config';
import { eventHandlers } from './events';
import { EnvError } from './interfaces/customErrors';
import * as Logger from './utils/logger';

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  throw new EnvError('No BOT_TOKEN in .env');
}

export const bot = new TelegramBot(botToken);

export function startBot() {
  eventHandlers();
  bot.startPolling();

  Logger.info('Bot running');
}

export function reply(
  msg: TelegramBot.Message,
  text: string
): Promise<TelegramBot.Message | undefined> {
  return bot.sendMessage(msg.chat.id, text, {
    parse_mode: 'Markdown',
    disable_notification: true,
  });
}
