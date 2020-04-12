
exports.up = function(knex) {
    return knex.schema.createTable('movimentacao', function (table) {
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.string('descricao');
        table.decimal('valor');
        table.string('categoria');
        table.date('data').notNullable();

        table.string('user_id').notNullable();
        table.string('caixa_id').notNullable();
        
        table.foreign('user_id').references('id').inTable('user');
        table.foreign('caixa_id').references('id').inTable('caixa');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('movimentacao');
};
