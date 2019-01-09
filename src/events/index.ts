import { commandHandler } from './command';
import { messageHandler } from './message';
import { soundHandler } from './sound';

export enum UserActions {
  SendingSound = 'sending sound',
  WritingName = 'writing name',
}

export enum BotResponse {
  Welcome = 'Hello! Type /add to add your own sound',
  Action = '🤔 Something went wrong, try again or type /cancel',
  NotEnoughArgs = '🤔 I need more arguments than that',
  SoundNotFound = '🤔 You don\'t have sound with that name',
  IdentifierExists = '🤦🏻‍♂️ Pick another name, that\'s already taken.',
  NoSoundsYet = '😰 No sounds yet! Type /add to add your first one',
  SoundDeleted = '🤯 Sound was deleted',
}

export function eventHandlers() {
  commandHandler();
  messageHandler();
  soundHandler();
}
