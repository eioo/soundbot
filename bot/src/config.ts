// Read process.env only through this file!
import * as dotenv from 'dotenv';
import * as os from 'os';
import * as path from 'path';

dotenv.config({
  path: path.join(__dirname, '../../.env'),
});

const config = {
  db: {
    host: process.env.POSTGRES_HOST || 'localhost',
    database: process.env.POSTGRES_DATABASE || 'postgres',
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
  },
  botToken: process.env.BOT_TOKEN || '',
  tempPath: os.tmpdir(),
  testChatId: Number(process.env.TEST_CHAT_ID) || 1,
  webHost: process.env.REACT_APP_HOST || 'localhost',
  webPort: process.env.REACT_APP_PORT || 3000,
  socketPort: Number(process.env.REACT_APP_SOCKET_PORT) || 1234,
};

export default config;
