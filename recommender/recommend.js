const path = require('path')

const rscriptHeader = 'Rscript --vanilla';
const rscriptTarget = path.join(__dirname, 'recommend.R');
const rscriptLocation = __dirname;

const exec = require('child-process-promise').exec

function fetchRecommendations(ratingJSON){
  const scriptString = `${rscriptHeader} ${rscriptTarget}  ${rscriptLocation} '${JSON.stringify(ratingJSON)}'`
  console.log(scriptString)
  return exec(scriptString)
}

function cleanRecommendations(ratingJSON){
  return fetchRecommendations(ratingJSON)
    .then(result => {
      console.log(result.stderr)
      return(result.stdout.split('\n').map(Number).filter(Boolean))
    })
}

// cleanRecommendations(outputJSON);
module.exports = {
  cleanRecommendations
}