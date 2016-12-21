jQuery.noConflict();
$ = jQuery;

$(document).ready(function(){
  $('form').on('submit', function(event){
    event.preventDefault();
    $('#recommendation-container').empty();
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
  $container = $('#recommendation-container')
  for (recommendation of orderedRecommendation){
    $container
      .append($(template({animeName: recommendation.name, animeIMG: '', animeID: recommendation.id})).addClass('animate').data("data-mal-id", recommendation.id))
  }
}

function fetchRecommendation(userName){
  return  $.getJSON({
    url: `/${userName}`,
    method: 'GET',
    });
}