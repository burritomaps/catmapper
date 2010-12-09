$(function(){
  $.ajax({
    url: "http://vimeo.com/api/v2/maxogden/videos.json",
    dataType: 'jsonp',
    success: function(data){
      $.each(data, function(i, video){
        if (video.tags == 'catmapper') {
          var embed = $('<div class="cat-video"></div>');
          $('.cat-nav').append(embed);
          var width = $(window).width() - 540;
          embed.oembed(video.url, {width: width, vimeo: {width: width, portrait: false, byline: false}});
        }
      })
    }
  });
});