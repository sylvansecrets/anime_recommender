"use strict";

const settings = require('./knex_settings');

const knex = require('knex')(settings);

const Promise = require('bluebird');
let currentTime = (new Date (Date.now())).toISOString().slice(0,10);

function writeAllRatings(input_json){
  const nid = input_json['user_id'];
  const user_name = input_json['user_name'];
  // let currentTime = (new Date (Date.now())).toISOString().slice(0,10);
  return knex.transaction(function(transact){
    injectUser(user_name, nid, currentTime, transact)
    .then(() => {
          show_promises = [];
          rank_promises = [];
    }
      )
  })
}

function injectUser(user_name, nid, transact){
  let currentTime = Math.floor(Date.now()/1000);
  currentTime = '1174107141'
  return knex.raw(
      `
        INSERT INTO users (nid, name, last_queried)
        VALUES (${nid}, '${user_name}', to_timestamp(${currentTime})) ON CONFLICT (nid) DO
        UPDATE
        SET last_queried = to_timestamp(${currentTime})
      `
    )
}

function injectShow(show_name, nid, transact){
  return knex.raw(
      `
        INSERT INTO shows (nid, name)
        VALUES (${nid}, '${show_name}') ON CONFLICT (nid) DO
        UPDATE
        SET nid = ${nid}
      `
    )
}

function injectRating(user_nid, show_nid, rating, last_rated){
  return knex.raw(
      `
        INSERT INTO ratings (user_nid, show_nid, rating, last_rated)
        VALUES (${user_nid}, ${show_nid}, ${rating}, to_timestamp(${last_rated})) ON CONFLICT (user_nid, show_nid) DO
        UPDATE
        SET rating = ${rating}
      `
    )
}
;

injectUser('sample', '21', currentTime).then(console.log('complete'))
injectShow('Bloop', '548').then(console.log('Show added'))
injectRating('21', '548', 2, "1174107141").then(console.log('Rating added'))