var express = require('express');
var PORT = 31416;
var app = express();

app.use(express.static('./public'))

app.listen(PORT, function(){
  console.log("server running on port", PORT);
})
