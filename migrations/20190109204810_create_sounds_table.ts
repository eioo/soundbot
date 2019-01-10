import * as Knex from 'knex';

exports.up = (knex: Knex) => {
  return knex.schema.createTable('sounds', table => {
    table.bigInteger('file_size').notNullable();
    table.bigInteger('user_id').notNullable();
    table.integer('duration').notNullable();
    table.string('file_id').notNullable();
    table.string('mime_type').notNullable();
    table.string('performer');
    table.string('title');
    table.string('identifier').notNullable();
    table.string('type').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex: Knex) => {
  return knex.schema.dropTable('sounds');
};
