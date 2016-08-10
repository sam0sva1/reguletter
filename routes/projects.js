var express = require('express');
var fs = require('fs');
var router = express.Router();
var concat = require('../modules/concat.js');

router.get('/', function(req, res) {
	var name = req.params.name;
	var listOfProjects = fs.readdirSync(`projects`);
	res.send(listOfProjects);
});

router.get('/:name/piece', function(req, res) {
	var name = req.params.name;
	var listOfFiles = fs.readdirSync(`projects/${name}`);
	listOfFiles.forEach((fileName, i, arr) => {
		var toSlice = fileName.slice(0, -4);
		arr[i] = toSlice;
	});
	res.send(listOfFiles);
});

router.get('/:name/piece/:piece', function(req, res) {
	var params = req.params;
	var piece = fs.readFileSync(`projects/${params.name}/${params.piece}.rgl`);
	res.send(piece);
});

router.get('/:name/full', function(req, res) {
	var name = req.params.name;
	var path = `projects/${name}`;
	var mainFile = fs.readFileSync(`projects/${name}/main_${name}.rgl`, 'utf8');
	main = JSON.parse(mainFile);

	var fullText = concat(main.text, path);

	res.send(fullText);
});

router.get('/:name/create', function(req, res) {
  	var name = req.params.name;
	fs.mkdirSync(`projects/${name}`);

	var abbr = name.substring(0, 3);
	var data = JSON.stringify({name: `${name}`, text: `<snippet_${abbr}01>`});

	fs.appendFileSync(`projects/${name}/main_${name}`, data);
	var result = fs.readFileSync(`projects/${name}/main_${name}`, 'utf8');
	console.log(result);
	res.send('Done');
});

module.exports = router;