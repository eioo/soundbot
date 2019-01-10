import * as TelegramBot from 'node-telegram-bot-api';
import { Message } from 'node-telegram-bot-api';
import { eventHandlers } from './events';
import { EnvError } from './lib/customErrors';

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  throw new EnvError('No BOT_TOKEN in .env');
}

export const bot = new TelegramBot(botToken);

export async function startBot() {
  bot.startPolling();

  eventHandlers();

  console.log('Bot running');
}

export async function reply(
  msg: Message,
  text: string
): Promise<Message | undefined> {
  return await bot.sendMessage(msg.chat.id, text, {
    parse_mode: 'Markdown',
    disable_notification: true,
  });
}
