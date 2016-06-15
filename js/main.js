

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

	if(navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(found_location, no_location);
	} else {
		no_location();
	}

	var markers = [];
	var map = new google.maps.Map(document.getElementById('map-canvas'), {
		//mapTypeId: google.maps.MapTypeId.ROADMAP, zoom: 14
		center: {lat: coordLat, lng: coordLong},
		zoom: 14
	});

  infowindow = new google.maps.InfoWindow();

  // Create the search box and link it to the UI element.
  var input = /** @type {HTMLInputElement} */(
      document.getElementById('pac-input'));
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
  var jsonURL = "https://localhost/data.json?lat="+coordLat+"&long="+coordLong;


  $.get(jsonURL, function(data){
    for(i = 0; i < data.length; i++){
      mapMarkers[i] = data[i];
      var marker = new google.maps.Marker({
        map: map,
        //icon: data[i].image,
        title: data[i].name,
        position: {lat: data[i].gps.latitude, lng: data[i].gps.longitude}
      });
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(this.title);
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
