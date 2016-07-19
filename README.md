# Citi Bike Navigation App
### An app combining Citi Bike station data and Google Maps.

**Now live at [http://a-fry.io/citibike](http://a-fry.io/citibike)**

**App summary:**
The app takes live Citi Bike station data and combines it with Google Maps walking and cycling directions
to create step-by-step directions for getting from your origin point to your destination via Citi Bike. After entering the addresses of where you're departing from and where you're traveling to, the app first queries the Citi Bike API to find the closest station to your origin point that currently has bikes available. It then provides walking instructions to that station, maps out cycling directions between that Citi Bike station and the station closest to your destination point that has docking stations free, and finally gives you walking directions from that Citi Bike station to your destination. In the left-hand column of the page, the step-by-step directions are listed out for each step of the process (walking - cycling - walking), and the addresses and current status of each Citi Bike station are also listed.

**Process:**
The most challenging part of the whole process was integrating Google Maps into the app. The Google Maps API is really massive, so it took some work to figure out what was possible with the API and how to best integrate the features I needed into the app. The documentation on the Citi Bike API was a little sparse, so it took some trial and error before I was finally able to use the data. There was also some work to be done in terms of taking the user input and feeding it into the various parts of the app so the individual components could function properly. But once I had assembled all the pieces I needed it was really just a matter of tweaking the outputs and the order everything was called in before I had a functioning app! Seeing it run successfully the first time was pretty satisfying.

**Technologies used:**
Handlebars, jQuery, the Google Maps API and the Citi Bike API were the primary technologies used.

**Things I'd like to improve on**

There's room to expand in terms of functionality. It would be nice if you could click on your start and end points on the map instead of typing them in manually, and I'd like to find some way to disable the cycling instructions layer seeing as all the green on the page is a little distracting.
