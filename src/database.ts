import * as Knex from 'knex';
import * as knexStringcase from 'knex-stringcase';
import { ISound, IUser } from './interfaces/types';

export const pg = Knex(
  knexStringcase({
    client: 'pg',
    connection: {
      host: process.env.POSTGRES_HOST,
      database: process.env.POSTGRES_DATABASE,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
  })
);

export async function addUser(userId: number): Promise<IUser> {
  const user: IUser = await pg('users')
    .insert({
      userId,
    })
    .returning('*')
    .get(0);

  return user;
}

export async function userExists(userId: number): Promise<boolean> {
  const result = await pg('users').where({ userId });
  return Boolean(result.length);
}

export async function setUserAction(userId: number, action: string) {
  if (!(await userExists(userId))) {
    await addUser(userId);
  }

  return pg('users')
    .update('currentAction', action)
    .where({ userId });
}

export async function getUserAction(userId: number): Promise<string> {
  if (!(await userExists(userId))) {
    await addUser(userId);
  }

  const result = await pg('users')
    .select('currentAction')
    .where({ userId })
    .get(0);

  if (!result) {
    const user = await addUser(userId);
    return user.current_action;
  }

  return result.current_action;
}

export async function clearUserAction(userId: number) {
  return setUserAction(userId, '');
}

export async function setCurrentSound(userId: number, sound: ISound) {
  return pg('users')
    .update('lastSound', JSON.stringify(sound))
    .where({ userId });
}

export async function getLastSound(userId: number): Promise<ISound> {
  const result = await pg('users')
    .select('lastSound')
    .where({ userId })
    .get(0);

  return result.last_sound;
}

export async function getSound(
  identifier: string
): Promise<ISound | undefined> {
  const result = await pg('sounds')
    .select('*')
    .where({ identifier })
    .get(0);

  return result;
}

export async function getSoundFromUser(
  userId: number,
  identifier: string
): Promise<ISound | undefined> {
  const result = await pg('sounds')
    .select('*')
    .where({
      userId,
      identifier,
    })
    .get(0);

  return result;
}

export async function getAllSounds(): Promise<ISound[]> {
  const result = await pg('sounds').select(
    'identifier',
    'fileId',
    'mimeType',
    'fileSize',
    'type'
  );
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

export async function addSound(userId: number, sound: ISound) {
  await pg('sounds').insert({
    ...sound,
    userId,
  });
}

export async function deleteSound(identifier: string) {
  await pg('sounds')
    .where({ identifier })
    .del();
}

export async function deleteSoundFromUser(userId: number, identifier: string) {
  await pg('sounds')
    .where({ identifier, userId })
    .del();
}
