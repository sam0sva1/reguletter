var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var xpr = express();
var projects = require('./routes/projects.js')

xpr.use(express.static('./static/'));

xpr.use('/projects', projects);

xpr.listen(8080, function () {
  console.log('App runs on 8080.');
});