import * as dotenv from 'dotenv';
import { log } from 'util';

dotenv.config();
process.env.NTBA_FIX_319 = '😋';

process.on('unhandledRejection', e => {
  log(e);
});

import { startBot } from './bot';

startBot();
