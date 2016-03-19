// var myUrl = "http://www.citibikenyc.com/stations/json"

// var myUrl = "http://appservices.citibikenyc.com/v1/station/list"

//the following URL works, but it's not very up to date......
var myUrl = "http://api.citybik.es/citi-bike-nyc.json"



// var findCitiBike = function() {
//   $.ajax({
//     type: 'GET',
//     url: "http://www.citibikenyc.com/stations/json",
//     // callback: "callback",
//     dataType: 'jsonp',
//     success: function(data) {
//       console.log(data)
//     }
//   })
// }

// var findCitiBike = function() {
//   $.ajax({
//     dataType: "json",
//     url: myUrl + '&callback=?',
//   }).done(function(data) {
//     console.log(data)
//   });
// }
//
var findCitiBike = function() {
  $.ajax({
    url: myUrl,
    dataType: "jsonp",
    jsonpCallback: 'callback',
    // type: 'GET',
  }).done(function(data) {
    console.log(data)
  });
}
findCitiBike();
