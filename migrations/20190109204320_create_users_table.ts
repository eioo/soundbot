import * as Knex from 'knex';
import { ISound } from '../src/lib/types';

exports.up = (knex: Knex) => {
  return knex.schema.createTable('users', table => {
    table.bigInteger('id').notNullable();
    table.string('current_action').defaultTo('');
    table.string('last_sound').defaultTo('{}');
  });
};

exports.down = (knex: Knex) => {
  return knex.schema.dropTable('users');
};
