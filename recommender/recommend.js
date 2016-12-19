const rscriptHeader = 'Rscript --vanilla';
const rscriptTarget = 'recommend.R';

const exec = require('child-process-promise').exec

function fetchRecommendations(ratingJSON){
  const scriptString = `${rscriptHeader} ${rscriptTarget} '${JSON.stringify(ratingJSON)}'`
  return exec(scriptString)
}

function cleanRecommendations(ratingJSON){
  return fetchRecommendations(ratingJSON)
    .then(result => {
      console.log(result.stdout.split('\n').map(Number).filter(Boolean))
    })
}

// cleanRecommendations(outputJSON);
module.exports = {
  cleanRecommendations
}