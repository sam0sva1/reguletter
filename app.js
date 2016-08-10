var express = require('express');
var fs = require('fs');
var app = express();
var projects = require('./routes/projects.js')

app.use('/projects', projects);

app.listen(8080, function () {
  console.log('App runs on 8080.');
});