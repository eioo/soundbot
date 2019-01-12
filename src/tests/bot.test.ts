import * as dotenv from 'dotenv';
dotenv.config();
process.env.NTBA_FIX_319 = '😋';

import * as TelegramBot from 'node-telegram-bot-api';
import { EnvError } from '../interfaces/customErrors';

const botToken = process.env.TEST_BOT_TOKEN;

if (!botToken) {
  throw new EnvError('No TEST_BOT_TOKEN in .env');
}

(async () => {
  const bot = new TelegramBot(botToken);
  bot.startPolling();
})();
