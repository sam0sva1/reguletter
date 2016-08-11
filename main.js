const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

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

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 1000, height: 800});
  mainWindow.loadURL('http://localhost:8080/index.html');
  mainWindow.webContents.openDevTools();
  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});