var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var app = express();
var projects = require('./routes/projects.js');

// var allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', 'example.com');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');

//     next();
// };

app.use(express.static('./static/'));
app.use(express.static('./modules/'));

app.use('/projects', projects);

app.listen(3000, function () {
  console.log('App runs on 3000.');
});