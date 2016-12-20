jQuery.noConflict();
$ = jQuery
$(document).ready(function(){
  $('form').on('submit', function(event){
    event.preventDefault();
    const userName = $(this).children('input').val();
    console.log("once")
    fetchRecommendation(userName)
    .then((orderedRecommendation) => {
      console.log('twice')
      const source   = $("#anime-template").html();
      const template = Handlebars.compile(source);
      renderAnime(orderedRecommendation, template)
    });
  })
});


function renderAnime(orderedRecommendation, template){
  console.log('thrice')
  for (recommendation of orderedRecommendation){
    $('#recommendation-container').append(template({animeName: recommendation.name, animeIMG: ''}))
  }
}

function fetchRecommendation(userName){
  return  $.getJSON({
    url: `/${userName}`,
    method: 'GET',
    });
}
