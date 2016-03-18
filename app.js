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

var findLatLong = function(origin, destination) {
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + origin + "&bounds=40.667219,-74.030623|40.808685,-73.910987&key=" + apiKey,
    dataType: "json",
    success: function(data) {
      console.log("origin latitude is as follows:")
      console.log(data["results"][0]["geometry"]["location"]["lat"]);
      console.log("origin longitude is as follows:")
      console.log(data["results"][0]["geometry"]["location"]["lng"]);
    }
  })
  $.ajax({
    url: "https://maps.googleapis.com/maps/api/geocode/json?address=" + destination + "&bounds=40.667219,-74.030623|40.808685,-73.910987&key=" + apiKey,
    callback: JSON,
    success: function(data) {
      console.log("destination latitude is as follows:")
      console.log(data["results"][0]["geometry"]["location"]["lat"]);
      console.log("destination longitude is as follows:")
      console.log(data["results"][0]["geometry"]["location"]["lng"]);
    }
  })
}
