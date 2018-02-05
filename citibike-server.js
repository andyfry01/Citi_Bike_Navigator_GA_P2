var express = require('express');
var app = express();

var PORT = 3002;

app.use(express.static('./public'))

app.listen(PORT, function(){
  console.log("server running on port", PORT);
})
