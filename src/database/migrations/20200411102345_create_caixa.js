
exports.up = function(knex) {
    return knex.schema.createTable('caixa', function (table) {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.decimal('entrada_limite');
        table.decimal('teto');
        //table.string('prioridade');
        table.decimal('saldo').notNullable();

        table.string('user_id').notNullable();

        table.foreign('user_id').references('id').inTable('user');
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable('caixa');
};
