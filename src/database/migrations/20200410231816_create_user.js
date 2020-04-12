
exports.up = function(knex) {
  return knex.schema.createTable('user', function (table) {
    table.increments('id').primary();
    table.string('cpf').notNullable();
    table.string('nome').notNullable();
    table.string('sobrenome').notNullable();
    table.string('email').notNullable();
    table.string('senha').notNullable();
    
  });
};

exports.down = function(knex) {
    return knex.schema.dropTable('user');
};
