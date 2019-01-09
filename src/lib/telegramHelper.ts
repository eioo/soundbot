import { Message } from 'node-telegram-bot-api';

export function extractName(msg: Message) {
  if (!msg.from) {
    return '';
  }

  return `${msg.from.first_name || ''} ${msg.from.last_name || ''}`;
}
