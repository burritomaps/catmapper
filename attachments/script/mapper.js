var app = {};

function render( template, target, data ) {
  if (! (target instanceof jQuery)) target = $( "." + target + ":first" );
  target.html( $.mustache( $( "." + template + "Template:first" ).html(), data ) );
}

var locWin = function(position) {
  var coords = position.coords;
  showMap(coords.latitude, coords.longitude);
};

var locFail = function(e) {
  if (navigator.geolocation) {
    err = "Cannot locate you -- Please enable geolocation in your settings";
  } else {
    err = "Error: Your browser doesnt support geolocation.";
  }
  alert(err)
  // default to downtown Boston
  showMap(42.35017139318913, -71.04257583618164);
};

function preventBehavior(e) { 
  e.preventDefault(); 
}
document.addEventListener("touchmove", preventBehavior, false);

function onReady() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(locWin, locFail);
    // also monitor position as it changes
  } else {
    locFail();
  }
  // navigator.geolocation.getCurrentPosition(locWin, locFail);
}

function isMobile() {
  userAgent = navigator.userAgent;
  if (userAgent.indexOf('iPhone') >= 0 || userAgent.indexOf('Android') >= 0 ) {
    return true;
  }
  return false;
}

function uploadLocation() {
  $.ajax({
    url: "/api",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      "geometry": app.lastLocation,
      "crowdsourced": true,
      "title": $('#title').val(),
      "description": $('#description').val()
    }),
    success: function() {
      $(':input').val('');
      $.mobile.changePage($('#success'));      
    }
  });
}

function bbox(map) {
  var bounds = map.getBounds();
  var sw = bounds.getSouthWest();
  var ne = bounds.getNorthEast();
  return sw.lng() + "," + sw.lat() + "," + ne.lng() + "," + ne.lat();
}

function showMap(latitude, longitude) {
  $('.crosshair').css('left', (document.body.clientWidth - 320) / 2);
  var geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(latitude, longitude);
  var address;        
  var myOptions = {
    center: latlng,
    zoom: 18,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    streetViewControl: false,
    mapTypeControl: false
  };
  var infowindow = new google.maps.InfoWindow();
  var directionDisplay;
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var markerArray = [];
  var stepDisplay = new google.maps.InfoWindow();

  app.map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
  directionsDisplay.setMap(app.map);

  var image = new google.maps.MarkerImage('images/catpin.png',
    new google.maps.Size(64, 31),
    new google.maps.Point(0,0),
    new google.maps.Point(16, 31)
  );

  var shadow = new google.maps.MarkerImage('images/shadow.png',
    new google.maps.Size(64, 52),
    new google.maps.Point(0,0),
    new google.maps.Point(10,32)
  );

  app.catMarker = new google.maps.Marker({
    position: new google.maps.LatLng(latitude,longitude), 
    clickable: true,
    icon: image,
    shadow: shadow,
    map: app.map 
  });  
  
  google.maps.event.addListener(app.map, 'dragend', function() { 
    app.catMarker.setPosition(app.map.getCenter()); 
    app.lastLocation = {
      "type": "Point",
      "coordinates": [app.map.getCenter().lng(), app.map.getCenter().lat()]
    };
  });
};

$(function() {
  $('.mapit').bind('touchend', uploadLocation);
  onReady();
});