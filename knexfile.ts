import * as path from 'path';
import config from './src/config';

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: config.db.host,
      database: config.db.database,
      user: config.db.user,
      password: config.db.password,
    },
    migrations: {
      directory: path.join(__dirname, 'migrations'),
    },
  },
};
