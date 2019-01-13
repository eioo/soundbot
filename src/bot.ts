import * as TelegramBot from 'node-telegram-bot-api';
import config from './config';
import { eventHandlers } from './events';
import * as Logger from './utils/logger';

export const bot = new TelegramBot(config.botToken);

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
