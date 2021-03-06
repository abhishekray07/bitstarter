var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

var fileData = fs.readFileSync('index.html');
var fileStr = fileData.toString();

app.get('/', function(request, response) {
  response.send(fileStr);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
