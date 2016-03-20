var start = document.getElementById("start");
var end = document.getElementById("end");
var submit = document.getElementById("submit");

submit.addEventListener("click", function() {
  origin = start.value;
  destination = end.value;
  findLatLong(origin, destination);
})

$(document).ajaxStop(function() {
  initMap();
})


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
  }).done(function(){
    findCitiBike();
  })
}

var originCoords = {
  lat: "",
  lng: ""
}

var destinationCoords = {
  lat: "",
  lng: ""
}

var stationLat;
var stationLng;

var originStationLat;
var originStationLng;
var fullOriginCoords;

var destinationStationLat;
var destinationStationLng;
var fullDestinationCoords = destinationStationLat + ", " + destinationStationLng;

var haversineResult = undefined;
var shortestOriginDistance = 10000;
var shortestDestinationDistance = 10000;


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


var findClosestStation = function(data) {

  haversineResult = undefined;
  originStationLat = undefined;
  originStationLng = undefined;
  shortestOriginDistance = 10000;

  for (var i = 0; i < data.length; i++) {
    var citiLat = (data[i]["lat"]).toString()
    formatCitiCoords(citiLat);
    var citiLng = (data[i]["lng"]).toString()
    formatCitiCoords(citiLng);
    haversine(originCoords.lat, originCoords.lng, stationLat, stationLng);

    if (haversineResult < shortestOriginDistance) {
      if (data[i]["bikes"] > 2) {
        shortestOriginDistance = haversineResult;
        originStationLat = stationLat;
        originStationLng = stationLng;
      }
    }

  }
  console.log("the closest citibike dock to the origin point with available bikes is at coords: " + originStationLat + ", " + originStationLng)
  fullOriginCoords = originStationLat + ", " + originStationLng;

  haversineResult = undefined;
  destinationStationLat = undefined;
  destinationStationLng = undefined;
  shortestDestinationDistance = 10000;

  for (var i = 0; i < data.length; i++) {
    var citiLat = (data[i]["lat"]).toString()
    formatCitiCoords(citiLat);
    var citiLng = (data[i]["lng"]).toString()
    formatCitiCoords(citiLng);
    haversine(destinationCoords.lat, destinationCoords.lng, stationLat, stationLng);

    if (haversineResult < shortestDestinationDistance) {
      if (data[i]["free"] >= 2) {
        shortestDestinationDistance = haversineResult;
        destinationStationLat = stationLat;
        destinationStationLng = stationLng;
      }
    }
  }
  console.log("the closest citibike dock to the destination point with available bikes is at coords: " + destinationStationLat + ", " + destinationStationLng)
  fullDestinationCoords = destinationStationLat + ", " + destinationStationLng
};


//converts lat and lng to radians
toRadians = function(num) {
  return num * Math.PI / 180;
}

//Haversine Formula, determines distance between two sets of lat/lng points
var haversine = function(lat1, lng1, lat2, lng2) {
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
}

//formats citibike coordinate data so it can be passed into haversine formula
var formatCitiCoords = function(coord) {
  if (coord[0] == "-") {
    var formattedCoord = [coord.slice(0, 3), ".", coord.slice(3)].join('');
    stationLng = parseFloat(formattedCoord);
  } else {
    var formattedCoord = [coord.slice(0, 2), ".", coord.slice(2)].join('');
    stationLat = parseFloat(formattedCoord);
  }
}

function initMap() {
    var gmaps       = google.maps,
        map         = new gmaps.Map(document.getElementById('map-canvas'),
                                  {
                                    center  : new gmaps.LatLng(40.72, -73.97),
                                    zoom    : 10
                                  }
                                 ),
        App         = { map               : map,
                        bounds            : new gmaps.LatLngBounds(),
                        directionsService : new gmaps.DirectionsService(),
                        directionsDisplay1: new gmaps.DirectionsRenderer({
                                              map             : map,
                                              preserveViewport: true,
                                              suppressMarkers : true,
                                              polylineOptions : {strokeColor:'red'},
                                              panel           : document.getElementById('panel').appendChild(document.createElement('li'))}),
                        directionsDisplay2: new gmaps.DirectionsRenderer({
                                              map             : map,
                                              preserveViewport: true,
                                              suppressMarkers : true,
                                              polylineOptions : {strokeColor:'blue'},
                                              panel           : document.getElementById('panel').appendChild(document.createElement('li'))}),
                        directionsDisplay3: new gmaps.DirectionsRenderer({
                                              map             : map,
                                              preserveViewport: true,
                                              suppressMarkers : true,
                                              polylineOptions : {strokeColor:'yellow'},
                                              panel           : document.getElementById('panel').appendChild(document.createElement('li'))
                                              })

            },
         startLeg   = {  origin     :  origin,
                        destination :  fullOriginCoords,
                        travelMode  :  gmaps.TravelMode.WALKING},
         middleLeg  = {  origin     :  fullOriginCoords,
                        destination :  fullDestinationCoords,
                        travelMode  :  gmaps.TravelMode.BICYCLING},
         endLeg     = { origin      :  fullDestinationCoords,
                        destination :  destination,
                        travelMode  :  gmaps.TravelMode.WALKING};

      App.directionsService.route(startLeg, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          App.directionsDisplay1.setDirections(result);
          App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
        }
      });

      App.directionsService.route(middleLeg, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          App.directionsDisplay2.setDirections(result);
          App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
        }
      });

      App.directionsService.route(endLeg, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          App.directionsDisplay3.setDirections(result);
          App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
        }
      });
}
