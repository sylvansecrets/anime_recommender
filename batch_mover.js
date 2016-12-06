'use strict';

const fs = require('fs');
const path = require('path')
const settings = require('./settings.json');

// the regular expression applies only to the last path
function moveMatching (fromLocation, toLocation, reg){
  let allFiles = fs.readdirSync(fromLocation);
  for (let file of allFiles){
    let basename = path.basename(file);
    if (basename.match(reg)){
      fs.renameSync(
        path.format({dir: fromLocation, base: file}),
        path.format({dir: toLocation, base: basename}))
    }
  }
}

