import * as dotenv from 'dotenv';

dotenv.config();
process.env.NTBA_FIX_319 = '😋';

import { startBot } from './bot';

process.on('unhandledRejection', e => {
  console.log(e);
});

startBot();
