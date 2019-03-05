import * as fs from 'fs';
import * as path from 'path';

import { initialize } from '../';
import { bot } from '../bot';
import config from '../config';
import { knex } from '../database';
import { botResponses } from '../events';
import { addListener, cancelListener, deleteListener, startListener } from '../events/command';
import { createSound } from '../utils/telegramHelper';
import { createMessage } from './createMessage';

initialize();

describe('Telegram bot command tests', () => {
  test('start command', async () => {
    const result = await startListener();
    expect(result).toBe(botResponses.welcome);
  });

  test('delete command (sound not found)', async () => {
    const msg = createMessage({
      text: '/del something that would not exist',
    });
    const result = await deleteListener(msg);

    expect(result === botResponses.soundNotFound).toBeTruthy();
  });

  test('add and cancel command', async () => {
    const addMsg = createMessage({
      text: '/add',
    });
    const cancelMsg = createMessage({
      text: '/cancel',
    });

    const resultAdd = await addListener(addMsg);
    const resultCancel = await cancelListener(cancelMsg);

    expect(resultAdd).toMatch(/.+please send\/record your sound.+/i);
    expect(resultCancel).toBe(botResponses.cancel);
  });

  test('add and delete command', async () => {
    const { testChatId } = config;
    const soundName = 'testsoundpleaseignore';
    const audioPath = path.join(__dirname, './sample.mp3');

    const addMsg = createMessage({
      text: '/add',
    });
    const deleteMsg = createMessage({
      text: `/delete ${soundName}`,
    });

    const audioStream = fs.createReadStream(audioPath);
    const audioMsg = await bot.sendAudio(testChatId, audioStream, {
      disable_notification: true,
    });

    if (!audioMsg.audio) {
      return fail();
    }

    const audioId = audioMsg.audio.file_id;

    const addResult = await addListener(addMsg);
    expect(addResult.startsWith('🎶')).toBeTruthy();

    const audioResult = await createSound(createMessage(), audioId, soundName);
    expect(audioResult).toMatch(/.+your sound was added.+/);

    const deleteResult = await deleteListener(deleteMsg);
    expect(deleteResult).toBe(botResponses.soundDeleted);

    await bot.deleteMessage(testChatId, audioMsg.message_id.toString());
  }, 10000);
});

afterAll(() => {
  bot.stopPolling();
  knex.destroy();
});
