import * as Knex from 'knex';

exports.up = (knex: Knex) => {
  return knex.schema.createTable('users', table => {
    table
      .bigInteger('user_id')
      .primary()
      .notNullable();
    table.string('current_action').nullable();
    table.bigInteger('current_chat_id').nullable();
    table
      .jsonb('last_sound')
      .defaultTo('{}')
      .notNullable();
  });
};

exports.down = (knex: Knex) => {
  return knex.schema.dropTable('users');
};
