var initMap = function() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: {
      lat: 40.72,
      lng: -73.97,
    }
  });
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById("turnbyturn"));

  var start = document.getElementById("start");
  var end = document.getElementById("end");
  var submit = document.getElementById("submit");

  submit.addEventListener("click", function() {
    origin = start.value;
    destination = end.value;
    calculateAndDisplayRoute(directionsService, directionsDisplay);
    findLatLong(origin, destination);
  })
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: document.getElementById('start').value,
    destination: document.getElementById('end').value,
    travelMode: google.maps.TravelMode.BICYCLING,
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

var originCoords = {
  lat: "",
  lng: ""
}

var destinationCoords = {
  lat: "",
  lng: ""
}

var findLatLong = function(origin, destination) {
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + origin + "&bounds=40.667219,-74.030623|40.808685,-73.910987&key=" + apiKey,
    dataType: "json",
    success: function(data) {
      console.log("origin latitude is as follows:");
      console.log(data["results"][0]["geometry"]["location"]["lat"]);
      console.log("origin longitude is as follows:");
      console.log(data["results"][0]["geometry"]["location"]["lng"]);
      originCoords["lat"] = data["results"][0]["geometry"]["location"]["lat"];
      originCoords["lng"] = data["results"][0]["geometry"]["location"]["lng"];
      console.log(originCoords)
    }
  })

  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + destination + "&bounds=40.667219,-74.030623|40.808685,-73.910987&key=" + apiKey,
    callback: JSON,
    success: function(data) {
      console.log("destination latitude is as follows:");
      console.log(data["results"][0]["geometry"]["location"]["lat"]);
      console.log("destination longitude is as follows:");
      console.log(data["results"][0]["geometry"]["location"]["lng"]);
      destinationCoords["lat"] = data["results"][0]["geometry"]["location"]["lat"];
      destinationCoords["lng"] = data["results"][0]["geometry"]["location"]["lng"];
      console.log(destinationCoords)
    }
  })
}

//converts lat and lng to radians
toRadians = function(num) {
    return num * Math.PI / 180;
  }
  //Haversine Formula
var haversine = function(lat1, lng1, lat2, lng2) {
  var R = 6371000;
  var φ1 = toRadians(lat1);
  var φ2 = toRadians(lat2);
  var deltaLat = lat2 - lat1;
  var deltaLng = lng1 - lng2;
  var Δφ = toRadians(deltaLat);
  var Δλ = toRadians(deltaLng);

  var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  var d = R * c;

  return d;
}

var findCitiBike = function() {
  haversine(originCoords.lat, originCoords.lng, destinationCoords.lat, destinationCoords.lng)
  $.ajax({
    url: "http://api.citybik.es/citi-bike-nyc.json",
    dataType: "jsonp",
    jsonpCallback: 'callback',
  }).done(function(data) {

    var closest = undefined;
    var shortestDistance = 10000;
    console.log(data[0]["lat"])
    for (var i = 0; i < 2; i++) {

      var citiLat = data[i]["lat"]
      var citLatString = citiLat.toString()
      console.log(citLatString)
      var citiLng = data[i]["lng"]
      var citLngString = citiLng.toString()
      console.log(citLngString)
    }
    // console.log(data)
  });
}

// findCitiBike();

//convert citibike coords to correct format
//going to need both .parseInt() and .toString()
// var output = num.slice(0, 2), ".", num.slice(2)].join('');

function addDecimel(num) {
  var numWithDecimal = [num.slice(0, 2), ".", num.slice(2)].join('');
  var output = parseFloat(numWithDecimal);
  return output;
}
