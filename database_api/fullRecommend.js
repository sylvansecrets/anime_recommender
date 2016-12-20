const scraper = require('./scraper');
const recommend = require('../recommender/recommend.js')

const settings = require('./knex_settings');
const knex = require('knex')(settings);
const Promise = require('bluebird');

function recommendOrder(userName){
  return scraper.retreiveMalJSON(userName)
    .then(result => {
      processedJSON = result['user_ratings'];
      for(show_nid in processedJSON){
        processedJSON[show_nid] = processedJSON[show_nid]['my_score'];
      }
      return processedJSON;
    })
}

function retreiveName(show_nid){
  return knex.select('name')
    .from('shows')
    .where('nid', show_nid);
}

function allNames(show_nids, showNames = []){
  if(show_nids.length){
    return retreiveName(show_nids.shift())
      .then(showName => {
        showNames.push(showName);
      })
      .then(() => {
        return allNames(show_nids, showNames);
      });
  } else {
    return showNames;
  }
}

function namedRecommendation(userName, top = 100){
  let watched;
  return recommendOrder(userName)
    .then(processedJSON => {
      watched = Object.keys(processedJSON);
      return recommend.cleanRecommendations(processedJSON);
    })
    .then(orderedList => {
      orderedList = orderedList.filter(show => watched.indexOf(String(show)) === -1);
      return allNames(orderedList.slice(0, top));
    });
}

// recommendOrder('konglamango')
namedRecommendation('konglamango')
