/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
  var colors = ['#FF0000', '#00FF00', '#FFFF00'];
  return colors[getRandomInt(0,2)];
}

/**
* Generates number of random geolocation points given a center and a radius.
* @param  {Object} center A JS object with lat and lng attributes.
* @param  {number} radius Radius in meters.
* @param {number} count Number of points to generate.
* @return {array} Array of Objects with lat and lng attributes.
*/
function generateRandomPoints(center, radius, count) {
  var points = [];
  for (var i=0; i<count; i++) {
    points.push(generateRandomPoint(center, radius));
  }
  return points;
}


/**
* Generates number of random geolocation points given a center and a radius.
* Reference URL: http://goo.gl/KWcPE.
* @param  {Object} center A JS object with lat and lng attributes.
* @param  {number} radius Radius in meters.
* @return {Object} The generated random points as JS object with lat and lng attributes.
*/
function generateRandomPoint(center, radius) {
  var x0 = center.lng;
  var y0 = center.lat;
  // Convert Radius from meters to degrees.
  var rd = radius/111300;

  var u = Math.random();
  var v = Math.random();

  var w = rd * Math.sqrt(u);
  var t = 2 * Math.PI * v;
  var x = w * Math.cos(t);
  var y = w * Math.sin(t);

  var xp = x/Math.cos(y0);

  // Resulting point.
  //return {'lat': y+y0, 'lng': xp+x0};
  return new google.maps.LatLng(y+y0, xp+x0);
}

function getRandomPolygon(center) {
  return generateRandomPoints(center, getRandomInt(100, 300), getRandomInt(100, 500));
}


// Usage Example.
// Generates 100 points that is in a 1km radius from the given lat and lng point.

var firstPlace;
var secondPlace;
var thirdPlace;

var mapMarkers = [];

  // Name/title, category, image, rating, lat/long

$("li").on("click", ".dropmenu1", function(){
  var sText = $(this).html();
  $("#drop1text").html(sText);
  randomizeTiles();
});

$("li").on("click", ".dropmenu2", function(){
  var sText = $(this).html();
  $("#drop2text").html(sText);
  randomizeTiles();
});

$("li").on("click", ".dropmenu3", function(){
  var sText = $(this).html();
  $("#drop3text").html(sText);
  randomizeTiles();
});

  $("li").on("click", "#sortDistance", function(){
    $("#sortButton").html($("#sortDistance").html());
  });

  $("li").on("click", "#sortRating", function(){
    $("#sortButton").html($("#sortRating").html());
  });  

var coordLat = 50.088182; // = position.coords.latitude
var coordLong = 14.420210; // = position.coords.longitude;

function found_location(position) {
  coordLat = position.coords.latitude;
  coordLong = position.coords.longitude;
}

function no_location() {
}

function initialize() {

//  $(".wait").hide();
//  $(".posContainer").hide();
//  $(".valuesContainer").hide();
//  $(".actionsContainer").hide();
//  $("#output").hide();
//
//  drawPOS();

  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(found_location, no_location);
  } else {
    no_location();
  }

  var markers = [];
  var map = new google.maps.Map(document.getElementById('map-canvas'), {
    //mapTypeId: google.maps.MapTypeId.ROADMAP, zoom: 14
    center: {lat: coordLat, lng: coordLong},
    mapTypeId: google.maps.MapTypeId.SATELLITE,
    zoom: 15
  });

  infowindow = new google.maps.InfoWindow();

  // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  //map.setOptions({draggable: false});
  var jsonURL = "data.json?lat="+coordLat+"&long="+coordLong;


  $.get(jsonURL, function(data){
    for(i = 0; i < data.length; i++){
      mapMarkers[i] = data[i];
      var marker = new google.maps.Marker({
        map: map,
        //icon: data[i].image,
        hid: data[i].name,
        title: data[i].name,
        position: {lat: data[i].gps.latitude, lng: data[i].gps.longitude}
      });
      /**var circle = new google.maps.Circle({
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: getRandomColor(),
        fillOpacity: 0.35,
        map: map,
        center: {lat: data[i].gps.latitude, lng: data[i].gps.longitude},
        radius: getRandomInt(1,8) * 100
      });*/
      var heatmap = new google.maps.visualization.HeatmapLayer({
          data: getRandomPolygon({lat: data[i].gps.latitude, lng: data[i].gps.longitude}),
          map: map
      });

      heatmap.set('opacity', heatmap.get('opacity') ? null : 0.50);

      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(this.title);
        random = getRandomInt(1,5);
//        drawRate('1', '6293341', '2016-06-1'+random, '1');
		diplayDashboard();
        infowindow.open(map, this);
      });
    }
    randomizeTiles();
  });

  // Bias the SearchBox results towards places that are within the bounds of the
  // current map's viewport.
  google.maps.event.addListener(map, 'bounds_changed', function() {
    var bounds = map.getBounds();
  });
}

google.maps.event.addDomListener(window, 'load', initialize);
  