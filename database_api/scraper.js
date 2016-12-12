const request = require('request-promise');
const cheerio = require('cheerio');

function retreiveMalJSON(username, tries = 3){
  apiString = `https://myanimelist.net/malappinfo.php?u=${username}&status=all&type=anime`
  return request(apiString)
    .then((outputHTML) => {
      const $ = cheerio.load(outputHTML,{xmlMode: true});
      const extractions = ["my_score","series_title", "series_animedb_id","my_last_updated"]
      const outputJSON = {'user_ratings':{}};
      outputJSON['user_id'] = $('user_id').html();
      outputJSON['user_name'] = $('user_name').html();
      const username = outputJSON['username']
      $('anime').each((i, elem) => {
        let animeID = $(elem).children('series_animedb_id').html();
        outputJSON['user_ratings'][animeID] = {};
        let animeObj = outputJSON['user_ratings'][animeID];
        for (let extract of extractions){
          animeObj[extract] = $(elem).children(extract).html();
        }
      })
      return outputJSON
    })
    .catch((err) => {
      setTimeout(() => {
        if (tries>0){
          console.log(`${username} timed out, \t trying again with ${err}`)
          return retreiveMalJSON(username, tries-1);
        } else {
          console.log(`Giving up on ${username}`)
        }
      }
      , 3000)
    })
}

function fetchUsers(){
  return request('https://myanimelist.net/users.php/')
  .then((outputHTML) => {
    const $ = cheerio.load(outputHTML);
    const namesArr = [];
    $('a[href*=profile]').each((i, elem) => {
      if ($(elem).text()){
        namesArr.push($(elem).text());
      }
    })
    return namesArr;
  })
}

module.exports = {
  retreiveMalJSON: retreiveMalJSON,
  fetchUsers: fetchUsers
}
