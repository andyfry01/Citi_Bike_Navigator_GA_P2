# Citi Bike Navigation App
### An app combining Citi Bike station data and Google Maps.

**App summary:**
The app takes live Citi Bike station data and combines it with Google Maps walking and cycling directions
to create step-by-step directions for getting from your origin point to your destination via Citi Bike. After entering the addresses of where you're departing from and where you're traveling to, the app first queries the Citi Bike API to find the closest station to your origin point that currently has bikes available. It then provides walking instructions to that station, maps out cycling directions between that Citi Bike station and the station closest to your destination point that has docking stations free, and finally gives you walking directions from that Citi Bike station to your destination. In the left-hand column of the page, the step-by-step directions are listed out for each step of the process (walking - cycling - walking), and the addresses and current status of each Citi Bike station are also listed.

**Process:**
The most challenging part of the whole process was integrating Google Maps into the app. The Google Maps API is really massive, so it took some work to figure out what was possible with the API and how to best integrate the features I needed into the app. The documentation on the Citi Bike API was a little sparse, so it took some trial and error before I was finally able to gain access to the data. There was also some work to be done in terms of taking the user input and feeding it into the various parts of the app so the individual components could function properly. But once I had assembled all the pieces I needed it was really just a matter of tweaking the outputs and the order everything was called in before I had a functioning app! Seeing it run successfully the first time was pretty satisfying.

**Technologies used:**
Handlebars, jQuery, the Google Maps API and the Citi Bike API were the primary technologies used.

**Hangups/things I'd like to improve on**
This first draft of the code is definitely not the cleanest or most eloquent JS I've ever written. If I had a few more days I could definitely refactor everything into smaller functions and get rid of a lot of extraneous material; as it is the code is pretty bad in terms of DRY. Ultimately, however, it works. I'd also like to spend some time styling of course.

There's also a ton of room to expand in terms of functionality. Right now you have to be pretty literal when entering the origin and destination addresses so Google Maps doesn't try to send you to Brooklyn, Wisconsin or somewhere crazy, there isn't much in the way of map markers or waypoints or other visual cues, it would be cool if you could click on your start and end points on the map instead of typing them in manually, I'd like to find some way to disable the cycling instructions layer seeing as all the green on the page is a little distracting, so on and so forth. But I did manage to get the basic elements all up on the page and working as they should.

**Resources:**

[Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/?hl=en_US)

[Google Maps Geocoding API](https://developers.google.com/maps/documentation/geocoding/intro?hl=en_US)

[Rendering multiple travel modes on one map](http://stackoverflow.com/questions/22922856/multiple-travel-modes-to-render-one-map-using-google-maps-api)

[Haversine formula for calculating distances between lat/lng points](http://www.movable-type.co.uk/scripts/latlong.html)

[Method for converting lat/lng to radians](http://stackoverflow.com/questions/5260423/torad-javascript-function-throwing-error)

[Adding decimals to Citi Bike lat/lng coordinates](http://stackoverflow.com/questions/4364881/inserting-string-at-position-x-of-another-string)
