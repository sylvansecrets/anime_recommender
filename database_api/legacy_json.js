'use strict';

const writeToDB = require('./writeUserRating.js').writeAllRatings;
const settings = require('../settings.json');
const fs = require('fs');
const path = require('path');
const admZip = require('adm-zip');
const Promise = require('bluebird');

function writeLegacy(){
  let legacy_jsons = settings.legacy_json_location;
  let allJSONs = fs.readdirSync(legacy_jsons);
  let writePromises = [];
  for (let file of allJSONs){
    console.log(file)
    writePromises.push(writeThenZip(file))
  }
  Promise.resolve(allJSONs).map(writeThenZip, {concurrency: 5})
}

function writeThenZip(filename){
  return (writeToDB
    (JSON.parse(fs.readFileSync(
      path.format({dir: settings.legacy_json_location, base: filename})
      ))
    )
    .then(() => console.log("Implement this!")))
}

