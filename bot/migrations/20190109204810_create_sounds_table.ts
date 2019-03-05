import * as Knex from 'knex';

exports.up = (knex: Knex) => {
  return knex.schema.createTable('sounds', table => {
    table.bigInteger('user_id').notNullable();
    table.string('file_id').notNullable();
    table.string('identifier').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex: Knex) => {
  return knex.schema.dropTable('sounds');
};
