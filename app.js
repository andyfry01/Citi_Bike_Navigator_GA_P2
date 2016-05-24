var start = document.getElementById("start");
var end = document.getElementById("end");
var submit = document.getElementById("submit");

var handleBarsContainer = document.getElementById("handlebars-container")

//handlebars source data
var stationData = {
  originName: undefined,
  numBikes: undefined,
  destinationName: undefined,
  numSlots: undefined
}

//Variables used in locating Citibike stations
var stationLat;
var stationLng;

//Coordinates from origin and destination addresses, used in Haversine formula
var originCoords = {
  lat: "",
  lng: ""
}
var destinationCoords = {
  lat: "",
  lng: ""
}

//Coordinates for the origin and destination citibike stations
var originStation = {
  lat: undefined,
  lng: undefined,
  fullCoords: undefined
}

var destinationStation = {
  lat: undefined,
  lng: undefined,
  fullCoords: undefined
}

var haversineResult = undefined;
var shortestDistance = 10000;
//refactor later with ln 37
var shortestOriginDistance = 10000;
var shortestDestinationDistance = 10000;

submit.addEventListener("click", function() {
  origin = start.value;
  destination = end.value;
  findLatLong(origin, destination);
})

//turns origin and destination addresses into coordinates for Haversine formula
var findLatLong = function(origin, destination) {
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + origin + "&bounds=40.667219,-74.030623|40.808685,-73.910987&key=" + apiKey,
    dataType: "json",
    success: function(data) {
      originCoords.lat = data["results"][0]["geometry"]["location"]["lat"];
      originCoords.lng = data["results"][0]["geometry"]["location"]["lng"];
    }
  })

  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + destination + "&bounds=40.667219,-74.030623|40.808685,-73.910987&key=" + apiKey,
    callback: JSON,
    success: function(data) {
      destinationCoords.lat = data["results"][0]["geometry"]["location"]["lat"];
      destinationCoords.lng = data["results"][0]["geometry"]["location"]["lng"];
    }
  }).done(function() {
    findCitiBike();
  })
}

//Queries Citibike data, calls findClosestStation
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

//Loops through Citibike data, finds closest stations to origin and destination addresses
var findClosestStation = function(data) {

  haversineResult = undefined;
  originStation.lat = undefined;
  originStation.lng = undefined;

  // originStationLat = undefined;
  // originStationLng = undefined;
  shortestOriginDistance = 10000;

  //first for loop, finds "origin station"
  for (var i = 0; i < data.length; i++) {
    var citiLat = (data[i]["lat"]).toString()
    formatCitiCoords(citiLat);
    var citiLng = (data[i]["lng"]).toString()
    formatCitiCoords(citiLng);
    haversine(originCoords.lat, originCoords.lng, stationLat, stationLng);

    if (haversineResult < shortestOriginDistance) {
      if (data[i]["bikes"] > 2) {
        shortestOriginDistance = haversineResult;
        originStation.lat = stationLat;
        originStation.lng = stationLng;
        stationData.originName = data[i]["name"]
        stationData.numBikes = data[i]["bikes"]
      }
    }
  }
  // console.log("the closest citibike dock to the origin point with available bikes is at coords: " + originStationLat + ", " + originStationLng)
  originStation.fullCoords = originStation.lat + ", " + originStation.lng;
  haversineResult = undefined;
  destinationStation.lat = undefined;
  destinationStation.lng = undefined;
  shortestDestinationDistance = 10000;

  //second for loop, finds "destination station"
  for (var i = 0; i < data.length; i++) {
    var citiLat = (data[i]["lat"]).toString()
    formatCitiCoords(citiLat);
    var citiLng = (data[i]["lng"]).toString()
    formatCitiCoords(citiLng);
    haversine(destinationCoords.lat, destinationCoords.lng, stationLat, stationLng);

    if (haversineResult < shortestDestinationDistance) {
      if (data[i]["free"] >= 2) {
        shortestDestinationDistance = haversineResult;
        destinationStation.lat = stationLat;
        destinationStation.lng = stationLng;
        stationData.destinationName = data[i]["name"]
        stationData.numSlots = data[i]["free"]
      }
    }
  }
  fillHandlebars(stationData)
  // console.log("the closest citibike dock to the destination point with available bikes is at coords: " + destinationStationLat + ", " + destinationStationLng)
  destinationStation.fullCoords = destinationStation.lat + ", " + destinationStation.lng
};

//Formats citibike coordinate data so it can be passed into haversine formula
var formatCitiCoords = function(coord) {
  if (coord[0] == "-") {
    var formattedCoord = [coord.slice(0, 3), ".", coord.slice(3)].join('');
    stationLng = parseFloat(formattedCoord);
  } else {
    var formattedCoord = [coord.slice(0, 2), ".", coord.slice(2)].join('');
    stationLat = parseFloat(formattedCoord);
  }
}

//converts lat and lng to radians for Haversine formula
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
var walking = 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'

var bicycle = "./img/bicycle.png"//Draws map on page after origin/destination information is filled in and stations have been located.
function initMap() {
  var gmaps = google.maps
  var map = new gmaps.Map(document.getElementById('map-canvas'), {
      center: new gmaps.LatLng(40.72, -73.97),
      zoom: 13
    })
  // var walkingMarkerOne = new google.maps.Marker({
  //   position: {origin},
  //   map: map,
  //   icon: './img/walking.png'
  // });
  // var walkingMarkerTwo = new google.maps.Marker({
  //   position: {destination},
  //   map: map,
  //   icon: './img/walking.png'
  // });
  // var bicycleMarkerOne = new google.maps.Marker({
  //   position: {lat: destinationStationLat, lng: destinationStationLng},
  //   map: map,
  //   icon: './img/bicycle.png'
  // });
  // var bicycleMarkerTwo = new google.maps.Marker({
  //   position: {lat: 40.82, lng: -74.07},
  //   map: map,
  //   icon: './img/bicycle.png'
  // });
    // Create the search box and link it to the UI element.
    var startSearchBox = new google.maps.places.SearchBox(start);
    console.log("start search box looks like this: ", start);

    var endSearchBox = new google.maps.places.SearchBox(end);
    console.log("end search box looks like this: ", end);

    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      startSearchBox.setBounds(map.getBounds());
    });

    var App = {
      map: map,
      bounds: new gmaps.LatLngBounds(),
      directionsService: new gmaps.DirectionsService(),
      directionsDisplay1: new gmaps.DirectionsRenderer({
        map: map,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: 'yellow'
        }
      }),
      directionsDisplay2: new gmaps.DirectionsRenderer({
        map: map,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: 'blue'
        }
      }),
      directionsDisplay3: new gmaps.DirectionsRenderer({
        map: map,
        preserveViewport: true,
        polylineOptions: {
          strokeColor: 'yellow'
        },
      })
    },
    startLeg = {
      origin: origin,
      destination: originStation.fullCoords,
      travelMode: gmaps.TravelMode.WALKING
    },
    middleLeg = {
      origin: originStation.fullCoords,
      destination: destinationStation.fullCoords,
      travelMode: gmaps.TravelMode.BICYCLING
    },
    endLeg = {
      origin: destinationStation.fullCoords,
      destination: destination,
      travelMode: gmaps.TravelMode.WALKING
    };

  App.directionsService.route(startLeg, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      App.directionsDisplay1.setDirections(result);
      document.getElementById("one").innerHTML = "";
      App.directionsDisplay1.setPanel(document.getElementById("one"));
      App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
    }
  });

  App.directionsService.route(middleLeg, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      App.directionsDisplay2.setDirections(result);
      document.getElementById("two").innerHTML = "";
      App.directionsDisplay2.setPanel(document.getElementById("two"));
      App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
    }
  });

  App.directionsService.route(endLeg, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      App.directionsDisplay3.setDirections(result);
      document.getElementById("three").innerHTML = "";
      App.directionsDisplay3.setPanel(document.getElementById("three"));
      App.map.fitBounds(App.bounds.union(result.routes[0].bounds));
    }
  });
}

//Fills handlebars template
var fillHandlebars = function(object) {
  handleBarsContainer.innerHTML = "";
  var templateSource = document.getElementById('handlebarsTemplate').innerHTML;
  var template = Handlebars.compile(templateSource);
  var container = document.getElementById('handlebars-container');
  var computedHtml = template(object);
  var filledTemplate = document.createElement("span");
  filledTemplate.innerHTML = computedHtml;
  handleBarsContainer.appendChild(filledTemplate);
}

//Initializes map after all ajax requests are done.
$(document).ajaxStop(function() {
  initMap();
})
