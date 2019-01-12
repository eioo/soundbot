import * as dotenv from 'dotenv';
dotenv.config();

import { pg } from '../database';

it('test db connection', async () => {
  await pg.raw('select 1+1 as result');
  expect(true).toBe(true);
});

afterAll(() => {
  pg.destroy();
});
