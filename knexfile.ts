import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    migrations: {
      directory: path.join(__dirname, 'migrations'),
    },
  },
};
