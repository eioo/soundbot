import * as TelegramBot from 'node-telegram-bot-api';
import { eventHandlers } from './events';
import { EnvError } from './interfaces/customErrors';
import * as Logger from './logger';

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  throw new EnvError('No BOT_TOKEN in .env');
}

export const bot = new TelegramBot(botToken);

export async function startBot() {
  bot.startPolling();

  eventHandlers();

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
