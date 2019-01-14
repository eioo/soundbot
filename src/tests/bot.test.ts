import TelegramTest = require('telegram-test');
import { initialize } from '..';
import { bot } from '../bot';
import { botResponses } from '../events';

initialize();

describe('Tellu testi', () => {
  const testChat = 1;

  test('start command', async () => {
    const telegramTest = new TelegramTest(bot);
    const data = await telegramTest.sendUpdate(testChat, '/start');

    expect(data.text).toBe(botResponses.welcome);
  });

  test('list command', async () => {
    const telegramTest = new TelegramTest(bot);
    const data = await telegramTest.sendUpdate(testChat, '/list');
    expect(typeof data.text === 'string').toBeTruthy();
  });

  test('listall command', async () => {
    const telegramTest = new TelegramTest(bot);
    const data = await telegramTest.sendUpdate(testChat, '/listall');
    expect(typeof data.text === 'string').toBeTruthy();
  });
});
