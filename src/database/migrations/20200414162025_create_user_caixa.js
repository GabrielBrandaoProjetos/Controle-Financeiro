
exports.up = function(knex) {
    return knex.schema.createTable('user_caixa', function (table) {
        table.integer('user_id');
        table.integer('caixa_id');

        table.foreign('user_id').references('id').inTable('user');
        table.foreign('caixa_id').references('id').inTable('caixa');
        
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable('user_caixa');
};
