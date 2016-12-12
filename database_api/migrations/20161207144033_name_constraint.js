
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('users', function(t){
    t.unique('name');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('users', function(t){
    t.dropUnique('name');
    });
};
