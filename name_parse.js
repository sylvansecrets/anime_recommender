'use strict';

const fs = require('fs');
const path = require('path');
const settings = require('./settings.json');

function parseNames(fileLocation){
  let inputString = fs.readFileSync(fileLocation, {encoding: 'utf-8'});
  let nameRegex = new RegExp ('(?=\/)(.*?)(?=\/profile\/)', 'g');
  let profileSet = new Set (inputString.match(nameRegex).map(element => element.replace('/', '')));
  profileSet.delete('')
  return profileSet
}

module.exports = {
  parseNames: parseNames
}