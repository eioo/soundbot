// Read process.env only through this file!

import * as dotenv from 'dotenv';
dotenv.config();

export default {
  db: {
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DATABASE || 'postgres',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
  },
  botToken: process.env.BOT_TOKEN,
  tempPath: './temp/',
};
