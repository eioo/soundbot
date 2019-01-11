import * as dotenv from 'dotenv';
import * as Logger from 'util';

dotenv.config();
process.env.NTBA_FIX_319 = '😋';

process.on('unhandledRejection', e => {
  Logger.log(e);
});

import { startBot } from './bot';

startBot();
