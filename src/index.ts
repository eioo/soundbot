import * as dotenv from 'dotenv';
import * as Logger from './utils/logger';

dotenv.config();
process.env.NTBA_FIX_319 = '😋'; // Gets rid of node-telegram-bot-api warnings
process.env.NTBA_FIX_350 = '😋'; // -//-

process.on('unhandledRejection', e => {
  Logger.error(e);
});

import { startBot } from './bot';

startBot();
