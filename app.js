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

var stationLat;
var stationLng;

var findCitiBike = function() {
  $.ajax({
    url: "http://api.citybik.es/citi-bike-nyc.json",
    dataType: "jsonp",
    jsonpCallback: 'callback',
  }).done(function(data) {
    console.log(data)
    findClosestStation(data);
  });
}

var originStationLat = undefined;
var originStationLng = undefined;
var destinationStationLat = undefined;
var destinationStationLng = undefined;

var haversineResult = undefined;
var shortestDistance = 10000;

var findClosestStation = function(data) {

  for (var i = 0; i < data.length; i++) {
    var citiLat = (data[i]["lat"]).toString()
    addDecimel(citiLat);
    var citiLng = (data[i]["lng"]).toString()
    addDecimel(citiLng);
    haversine(originCoords.lat, originCoords.lng, stationLat, stationLng);

    if (haversineResult < shortestDistance) {
      if (data[i]["bikes"] > 2) {
        shortestDistance = haversineResult;
        originStationLat = stationLat;
        originStationLng = stationLng;
      }
    }
  }
  console.log("the closest citibike dock to the origin point with available bikes is at coords: " + originStationLat + ", " + originStationLng)

  haversineResult = undefined;
  shortestDistance = 10000;

  for (var i = 0; i < data.length; i++) {
    var citiLat = (data[i]["lat"]).toString()
    addDecimel(citiLat);
    var citiLng = (data[i]["lng"]).toString()
    addDecimel(citiLng);
    haversine(destinationCoords.lat, destinationCoords.lng, stationLat, stationLng);

    if (haversineResult < shortestDistance) {
      if (data[i]["free"] >= 2) {
        shortestDistance = haversineResult;
        destinationStationLat = stationLat;
        destinationStationLng = stationLng;
      }
    }
  }
  console.log("the closest citibike dock to the destination point with available bikes is at coords: " + destinationStationLat + ", " + destinationStationLng)

};

//Haversine Formula
var haversine = function(lat1, lng1, lat2, lng2) {
  // console.log("origin lat " + lat1)
  // console.log("origin lng " + lng1)
  // console.log("station lat " + lat2)
  // console.log("station lng " + lng2)

  var R = 6371;
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

  haversineResult = d;
  // console.log("the haversine result is : " + haversineResult)
}
var addDecimel = function(num) {
  if (num[0] == "-") {
    var numWithDecimal = [num.slice(0, 3), ".", num.slice(3)].join('');
    stationLng = parseFloat(numWithDecimal);
    // console.log("the station lng is " + stationLat);
  } else {
    var numWithDecimal = [num.slice(0, 2), ".", num.slice(2)].join('');
    stationLat = parseFloat(numWithDecimal);
    // console.log("the station lat is " + stationLng);
  }
}
