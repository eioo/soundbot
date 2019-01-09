import * as Knex from 'knex';
import { ISound } from './lib/types';

export const pg = Knex({
  client: 'pg',
  connection: {
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  },
});

export async function addUser(userId: number) {
  await pg('users').insert({
    id: userId,
  });
}

export async function userExists(userId: number): Promise<boolean> {
  const result = await pg('users').where('id', userId);
  return !!result.length;
}

export async function setUserAction(userId: number, action: string) {
  await pg('users')
    .update('current_action', action)
    .where({ id: userId });
}

export async function getUserAction(userId: number): Promise<string> {
  const result = await pg('users')
    .select('current_action')
    .where({ id: userId })
    .get(0);

  return result.current_action;
}

export async function clearUserAction(userId: number) {
  setUserAction(userId, '');
}

export async function setCurrentSound(userId: number, sound: ISound) {
  await pg('users')
    .update('last_sound', JSON.stringify(sound))
    .where({ id: userId });
}

export async function getLastSound(userId: number): Promise<ISound> {
  const result = await pg('users')
    .select('last_sound')
    .where({ id: userId })
    .get(0);

  return result.last_sound;
}

export async function addSound(userId: number, sound: ISound) {
  await pg('sounds').insert({
    ...sound,
    user_id: userId,
  });
}

export async function getAllSounds(): Promise<ISound[]> {
  const result = await pg('sounds').select('*');
  return result;
}

export async function getAllSoundsFromUser(userId: number): Promise<ISound[]> {
  const result = await pg('sounds')
    .select('*')
    .where({
      user_id: userId,
    });

  return result;
}

export async function getSound(
  identifier: string
): Promise<ISound | undefined> {
  const result = await pg('sounds')
    .select('*')
    .where({
      identifier,
    });

  return result[0];
}

export async function getSoundFromUser(
  userId: number,
  identifier: string
): Promise<ISound | undefined> {
  const result = await pg('sounds')
    .select('*')
    .where({
      user_id: userId,
      identifier,
    });

  return result[0];
}

export async function deleteSound(identifier: string) {
  await pg('sounds')
    .where({ identifier })
    .del();
}
