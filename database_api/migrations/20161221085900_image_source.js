
exports.up = function(knex, Promise) {
  return knex.schema.table('shows', function(t){
    t.string('image_source');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.alterTable('shows', function(t){
    t.dropColumn('image_source');
    });
};
