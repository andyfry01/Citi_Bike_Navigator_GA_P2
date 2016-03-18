

function initMap() {
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: {
      lat: 41.85,
      lng: -87.65
    }
  });
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById("turnbyturn"));

  var start = document.getElementById("start");
  var end = document.getElementById("end");
  var submit = document.getElementById("submit");

  submit.addEventListener("click", function(){
    origin = start.value;
    destination = end.value;
    calculateAndDisplayRoute(directionsService, directionsDisplay);
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
