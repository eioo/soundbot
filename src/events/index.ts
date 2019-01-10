import { commandHandler } from './command';
import { messageHandler } from './message';
import { soundHandler } from './sound';

export const userActions = {
  sendingSound: 'sending sound',
  writingName: 'writing name',
};

export const botResponses = {
  identifierExists: "🤦🏻‍♂️ Pick another name, that's already taken",
  invalidIdentifier: `🤦🏻‍♂️ Name can't start with "/" or be empty`,
  noSoundsYet: '😰 No sounds yet! Type /add to add your first one',
  noVoiceOrAudio: '🤔 Got no sound / audio, try again or type /cancel',
  notEnoughArgs: '🤔 I need more arguments than that',
  soundDeleted: '🤯 Sound was deleted',
  soundNotFound: "🤔 You don't have sound with that name",
  welcome: 'Hello! Type /add to add your own sound',
};

export function eventHandlers() {
  commandHandler();
  messageHandler();
  soundHandler();
}
