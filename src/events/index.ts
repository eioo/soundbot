import { commandHandler } from './command';
import { messageHandler } from './message';
import { soundHandler } from './sound';

export const userActions = {
  sendingSound: 'sending sound',
  writingName: 'writing name',
};

export const botResponses = {
  welcome: 'Hello! Type /add to add your own sound',
  noVoiceOrAudio: '🤔 Something went wrong, try again or type /cancel',
  notEnoughArgs: '🤔 I need more arguments than that',
  soundNotFound: '🤔 You don\'t have sound with that name',
  identifierExists: '🤦🏻‍♂️ Pick another name, that\'s already taken.',
  noSoundsYet: '😰 No sounds yet! Type /add to add your first one',
  soundDeleted: '🤯 Sound was deleted',
};

export function eventHandlers() {
  commandHandler();
  messageHandler();
  soundHandler();
}
