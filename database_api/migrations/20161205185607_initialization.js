
exports.up = function(knex, Promise) {
  return createUsers()
    .then(addUniqueUser)
    .then (createShows)
    .then (addUniqueShow)
    .then (createRatings)
    .then (addUniqueRating)


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
      table.integer('show_nid');
      table.integer('user_nid');
      table.foreign('show_nid').references('shows.nid');
      table.foreign('user_nid').references('users.nid');
      table.integer('rating');
      table.timestamp('last_rated', true)
    });
  }

  function addUniqueRating(){
  return knex.schema.alterTable('ratings', function(t){
    t.unique(['show_nid', 'user_nid']);
    });
  }

  function addUniqueUser(){
  return knex.schema.alterTable('users', function(t){
    t.unique('nid');
    });
  }

  function addUniqueShow(){
  return knex.schema.alterTable('shows', function(t){
    t.unique('nid');
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
