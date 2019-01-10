// TODO: Not working currently. Needs file host.

/*
import { InlineQuery, InlineQueryResultAudio } from 'node-telegram-bot-api';
import { bot } from '../bot';
import { searchSounds } from '../database';

export async function inlineQueryHandler() {
  bot.on('inline_query', async (msg: InlineQuery) => {
    const offset = parseInt(msg.offset);
    const sounds = await searchSounds(msg.query, offset, 10);
    const results = [];

    for (const sound of sounds) {
      const url = await bot.getFileLink(sound.file_id);
      const result: InlineQueryResultAudio = {
        type: 'audio',
        audio_url: url,
        title: sound.identifier,
        id: sound.identifier.slice(0, 64),
      };

      results.push(result);
    }

    await bot.answerInlineQuery(msg.id, results, {
      next_offset: results.length ? (offset + 10).toString() : '',
    });
  });
}
*/
