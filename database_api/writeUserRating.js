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
    console.log(`Rating information for user ${user_name} with id ${user_nid} added`);
  })
  .catch((err) => {
    console.log(`Rating information for user ${user_name} with id ${user_nid} \t failed with error`, err)
  })
}


function injectUser(user_name, nid, transact, time){
  let currentTime = time || Math.floor(Date.now()/1000);
  function subQuery(){
    let queryString =
        `
          INSERT INTO users (nid, name, last_queried)
          VALUES (?, ?, to_timestamp(?)) ON CONFLICT (name) DO
          UPDATE
          SET last_queried = to_timestamp(?)
        `
    let polate = [nid, user_name, currentTime, currentTime]
    if (nid) {queryString += ',nid = ?'; polate.push(nid)}
    return knex.raw(
        queryString, polate
      )}
  if (transact) {return subQuery();}
  else {return knex.transaction(trx => subQuery().transacting(trx))}
}

function injectShow(show_name, nid, transact){
  function subQuery(){
    return knex.raw(
      `
        INSERT INTO shows (nid, name)
        VALUES (?, ?) ON CONFLICT (nid) DO
        UPDATE
        SET nid = ?
      `, [nid, show_name, nid]
    )
  }
  if (transact) {return subQuery();}
  else {return knex.transaction(trx => subQuery().transacting(trx))}
}

function injectRating(user_nid, show_nid, rating, last_rated, transact){
  function subQuery(){
    return knex.raw(
        `
          INSERT INTO ratings (user_nid, show_nid, rating, last_rated)
          VALUES (?, ?, ?, to_timestamp(?)) ON CONFLICT (user_nid, show_nid) DO
          UPDATE
          SET rating = ?
        `, [user_nid, show_nid, rating, last_rated, rating]
      )}
  if (transact) {return subQuery();}
  else {return knex.transaction(trx => subQuery().transacting(trx))}
};

// injectUser('sample', '21').then(console.log('complete'))
// injectShow('Bloop', '548').then(console.log('Show added'))
// injectRating('21', '548', 2, "1174107141").then(console.log('Rating added'))
// writeAllRatings(sample_input);
// console.log(escape("dfa's"))

module.exports = {
  writeAllRatings: writeAllRatings,
  injectUser: injectUser
}