
exports.up = function(knex, Promise) {
  return createUsers()
    .then (createShows)
    .then (createRatings)
    .then (addUniqueRating)
    .then (addUniqueUser)
    .then (addUniqueShow)


  function createUsers(){
    return knex.schema.createTable('users', function(table){
      table.increments();
      table.integer('nid');
      table.timestamp('last_queried', true).defaultTo(knex.fn.now());
      table.text('name');
    })
  }

  function createShows(){
    return knex.schema.createTable('shows', function(table){
      table.increments();
      table.integer('nid');
      table.text('name');
    });
  }

  function createRatings(){
    return knex.schema.createTable('ratings', function(table){
      table.increments();
      table.integer('show_id');
      table.integer('user_id');
      table.foreign('show_id').references('shows.id');
      table.foreign('user_id').references('users.id');
      table.integer('rating');
      table.timestamp('last_rated', true)
    });
  }

  function addUniqueRating(){
  return knex.schema.alterTable('ratings', function(t){
    t.unique(['show_id', 'user_id'])
    });
  }

  function addUniqueUser(){
  return knex.schema.alterTable('users', function(t){
    t.unique('nid')
    });
  }

  function addUniqueShow(){
  return knex.schema.alterTable('shows', function(t){
    t.unique('nid')
    });
  }

};

exports.down = function(knex, Promise) {
  return deleteRatings()
    .then(deleteShows)
    .then(deleteUsers)

  function deleteUsers(){
    return knex.schema.dropTable('users')
  }

  function deleteShows(){
    return knex.schema.dropTable('shows')
  }

  function deleteRatings(){
    return knex.schema.dropTable('ratings')
  }
};
