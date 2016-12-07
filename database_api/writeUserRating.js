"use strict";

const settings = require('./knex_settings');
const knex = require('knex')(settings);
const Promise = require('bluebird');
const sample_input = require('./1653.json');

function writeAllRatings(input_json){
  const user_nid = input_json['user_id'];
  const user_name = input_json['user_name'];
  return knex.transaction(function(transact){
    injectUser(user_name, user_nid, transact)
    .then(() => {
      let show_promises = [];
      let rank_promises = [];
      for (let show_nid in input_json['user_ratings']){
        show_promises.push(
          injectShow(input_json['user_ratings'][show_nid]['series_title'], show_nid, transact)
          );
        rank_promises.push(
          injectRating(user_nid, show_nid, input_json['user_ratings'][show_nid]['my_score'], input_json['user_ratings'][show_nid]['my_last_updated'], transact)
          );
      }
      return (Promise.all(show_promises))
        .then(Promise.all(rank_promises))
        .catch((err) => {
          throw err
        })
    })
    .then(transact.commit)
    .catch((err) => {
      transact.rollback;
      console.log('transaction failed with \n', err)
    })
  })
  .then(() => {
    console.log(`Rating information for user ${user_name} with id ${user_nid} added`)
  })
  .catch((err) => {
    console.log(`Rating information for user ${user_name} with id ${user_nid} \t failed with error ${err}`)
  })
}

function injectUser(user_name, nid, transact){
  let currentTime = Math.floor(Date.now()/1000);
  return knex.raw(
      `
        INSERT INTO users (nid, name, last_queried)
        VALUES (${nid}, '${user_name}', to_timestamp(${currentTime})) ON CONFLICT (nid) DO
        UPDATE
        SET last_queried = to_timestamp(${currentTime})
      `
    )
    .transacting(transact)
}

function injectShow(show_name, nid, transact){
  return knex.raw(
      `
        INSERT INTO shows (nid, name)
        VALUES (?, ?) ON CONFLICT (nid) DO
        UPDATE
        SET nid = ?
      `, [nid, show_name, nid]
    )
    .transacting(transact)
}

function injectRating(user_nid, show_nid, rating, last_rated, transact){
  return knex.raw(
      `
        INSERT INTO ratings (user_nid, show_nid, rating, last_rated)
        VALUES (${user_nid}, ${show_nid}, ${rating}, to_timestamp(${last_rated})) ON CONFLICT (user_nid, show_nid) DO
        UPDATE
        SET rating = ${rating}
      `
    )
    .transacting(transact)
}
;

// injectUser('sample', '21').then(console.log('complete'))
// injectShow('Bloop', '548').then(console.log('Show added'))
// injectRating('21', '548', 2, "1174107141").then(console.log('Rating added'))
// writeAllRatings(sample_input);
// console.log(escape("dfa's"))

module.exports = {
  writeAllRatings: writeAllRatings
}