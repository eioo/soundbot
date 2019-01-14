import TelegramTest = require('telegram-test');
import { initialize } from '..';
import { bot } from '../bot';
import { botResponses } from '../events';

initialize();

describe('Telegram bot tests', () => {
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

  test('delete command', async () => {
    const telegramTest = new TelegramTest(bot);
    const data = await telegramTest.sendUpdate(
      testChat,
      '/delete something that would not exist'
    );
    expect(data.text).toBe(botResponses.soundNotFound);
  });

  test('add and cancel command', async () => {
    const telegramTest = new TelegramTest(bot);
    const cmdResponse = await telegramTest.sendUpdate(testChat, '/add');

    expect(cmdResponse.text).toMatch(/.+please send\/record your sound.+/i);

    const cancelResponse = await telegramTest.sendUpdate(testChat, '/cancel');

    expect(cancelResponse.text).toBe(botResponses.cancel);
  });
});
