import * as Knex from 'knex';
import knexStringcase = require('knex-stringcase');
import { Message, User } from 'node-telegram-bot-api';
import * as pg from 'pg';
import config from './config';
import { ISound, IUser, IUserAction } from './interfaces/types';

const PG_BIGINT = 20;
pg.types.setTypeParser(PG_BIGINT, parseFloat);

export const knex = Knex(
  knexStringcase({
    client: 'pg',
    connection: {
      host: config.db.host,
      database: config.db.database,
      user: config.db.user,
      password: config.db.password,
    },
  })
);

export async function addUser(msg: Message): Promise<IUser> {
  const userId = (msg.from as User).id;
  const user: IUser = await knex('users')
    .insert({
      userId,
    })
    .returning('*')
    .get(0);

  return user;
}

export async function userExists(msg: Message): Promise<boolean> {
  const userId = (msg.from as User).id;
  const result = await knex('users').where({ userId });

  return Boolean(result.length);
}

export async function setUserAction(msg: Message, action?: string) {
  const userId = (msg.from as User).id;

  if (!(await userExists(msg))) {
    await addUser(msg);
  }

  return knex('users')
    .update({
      currentAction: action || null,
      currentChatId: action ? msg.chat.id : null,
    })
    .where({ userId });
}

export async function getUserState(msg: Message): Promise<IUserAction> {
  if (!(await userExists(msg))) {
    await addUser(msg);
  }

  const userId = (msg.from as User).id;

  const { currentAction, currentChatId } = await knex('users')
    .select('currentAction', 'currentChatId')
    .where({ userId })
    .get(0);

  return {
    currentAction,
    currentChatId,
  };
}

export async function clearUserAction(msg: Message) {
  return setUserAction(msg);
}

export async function setCurrentSound(msg: Message, sound: ISound) {
  const userId = (msg.from as User).id;

  return knex('users')
    .update('lastSound', JSON.stringify(sound))
    .where({ userId });
}

export async function getLastSound(msg: Message): Promise<ISound> {
  const userId = (msg.from as User).id;
  const { lastSound } = await knex('users')
    .select('lastSound')
    .where({ userId })
    .get(0);

  return lastSound;
}

export async function getSound(
  identifier: string
): Promise<ISound | undefined> {
  const result = await knex('sounds')
    .select('*')
    .where({ identifier })
    .get(0);

  return result;
}

export async function getSoundFromUser(
  msg: Message,
  identifier: string
): Promise<ISound | undefined> {
  const userId = (msg.from as User).id;

  const result = await knex('sounds')
    .select('*')
    .where({
      userId,
      identifier,
    })
    .get(0);

  return result;
}

export async function getAllSounds(): Promise<ISound[]> {
  const result = await knex('sounds').select('identifier', 'fileId');

  return result;
}

export async function getAllSoundsFromUser(msg: Message): Promise<ISound[]> {
  const userId = (msg.from as User).id;
  const result = await knex('sounds')
    .select('*')
    .where({
      userId,
    });

  return result;
}

export async function addSound(msg: Message, sound: ISound) {
  const userId = (msg.from as User).id;

  await knex('sounds').insert({
    ...sound,
    userId,
  });
}

export async function deleteSound(identifier: string) {
  await knex('sounds')
    .where({ identifier })
    .del();
}

export async function deleteSoundFromUser(msg: Message, identifier: string) {
  const userId = (msg.from as User).id;

  await knex('sounds')
    .where({ identifier, userId })
    .del();
}
