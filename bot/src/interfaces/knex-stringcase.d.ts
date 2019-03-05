declare module 'knex-stringcase' {
  import * as knex from 'knex';

  function knexStringcase(config: knex.Config): knex.Config;
  export = knexStringcase;
}
