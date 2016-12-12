'use strict';

const scraper = require('./scraper');
const Promise = require('bluebird');
const writeToDB = require('./writeUserRating.js').writeAllRatings;
const injectUser = require('./writeUserRating.js').injectUser
const settings = require('./knex_settings');
const knex = require('knex')(settings);

const mode = process.argv[2] || 'user'
const updateSize = process.argv[3] || 10


function getNames(updateSize){
  return knex.select('name', 'nid', 'last_queried')
    .from('users')
    .limit(updateSize)
    .orderBy('last_queried', 'asc')
}

function pipeJSON(username){
  return scraper.retreiveMalJSON(username)
    .then((outputJSON) => {
      writeToDB(outputJSON);
    })
}

function updateUsers(userQueue){
  if (userQueue.length){
    scraper.retreiveMalJSON(userQueue.shift())
    .then(writeToDB)
    .then(updateUsers.bind(null, userQueue))
  }
}

function blankUsers(countdown){
  if (countdown){
    scraper.fetchUsers()
    .then((queriedNames) => {
      let namePromises = [];
      console.log(queriedNames);
      queriedNames.forEach(name => {
        namePromises.push(injectUser(name, null , null, 1))
      })
      console.log('executing promises')
      Promise.all(queriedNames);
    })
    .then(() => setTimeout(() => blankUsers(countdown-1), 2000))
  }
}

function fullAPI(countdown){
  if (countdown){
    scraper.fetchUsers()
    .then(updateUsers)
    .then(knex.destroy())
    .then(() => setTimeout(() => fullAPI(countdown-1), 2000))
  } else {
    console.log('completed')
  }
}

switch (mode){
  case 'user':
    console.log('start')
    blankUsers(updateSize);
    break;
  case 'api':
    getNames(updateSize).then((nameObj)=> updateUsers(nameObj.map(obj => obj.name))).then((input) => console.log("Done"))
    break;
  case 'full_api':
    fullAPI(updateSize);
    break;
}
