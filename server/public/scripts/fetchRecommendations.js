jQuery.noConflict();
$ = jQuery;

$(document).ready(function(){
  $('form').on('submit', function(event){
    event.preventDefault();
    $('#recommendation-container').empty();
    const userName = $(this).children('input').val();
    fetchRecommendation(userName)
    .then((orderedRecommendation) => {
      const source   = $("#anime-template").html();
      const template = Handlebars.compile(source);
      renderAnime(orderedRecommendation, template)
    });
  })
});


function renderAnime(orderedRecommendation, template){
  const defaultIMG = 'http://imgur.com/a/yaSCZ'
  $container = $('#recommendation-container')
  for (recommendation of orderedRecommendation){
    const html = template({
        animeName: recommendation.name,
        animeIMG: recommendation.image_source || defaultIMG,
        animeID: recommendation.nid, });
    $(html).addClass('animate').appendTo($container);
  }
}

function fetchRecommendation(userName){
  return  $.getJSON({
    url: `/u/${userName}`,
    method: 'GET',
    });
}