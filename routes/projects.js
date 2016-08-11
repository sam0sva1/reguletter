var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var router = express.Router();
var concat = require('../modules/concat.js');

var jsonParser = bodyParser.json();

router.get('/', function(req, res) {
	var name = req.params.name;
	var listOfProjects = fs.readdirSync(`projects`);
	res.send(listOfProjects);
});

router.get('/:name/piece', function(req, res) {
	var name = req.params.name;
	var pieceArray = ['full'];
	var listOfFiles = fs.readdirSync(`projects/${name}`);
	listOfFiles.forEach((fileName, i, arr) => {
		if(fileName.indexOf("main") === -1) {
			var sliced = fileName.slice(0, -4);
			pieceArray[i+1] = sliced;
		}
	});
	res.send(pieceArray);
});

router.get('/:name/piece/merge', function(req, res) {
	var name = req.params.name;
	var path = `projects/${name}`;
	var mainFile = fs.readFileSync(`projects/${name}/main_${name}.rgl`, 'utf8');
	main = JSON.parse(mainFile);
	var fullText = concat(main.text, path);

	res.send(fullText);
});

router.get('/:name/piece/:piece', function(req, res) {
	var params = req.params;
	var piece = fs.readFileSync(`projects/${params.name}/${params.piece}.rgl`, 'utf8');
	res.send(piece);
});

router.post('/:name/piece/:piece', jsonParser, function(req, res) {
	var name = req.params.name;
	var piece = req.params.piece;
	var text = req.body.text;
	fs.writeFileSync(`projects/${name}/${piece}.rgl`, text, 'utf8');

	var body = fs.readFileSync(`projects/${name}/${piece}.rgl`, 'utf8');
	res.send(body);
});

router.get('/:name/create', function(req, res) {
  	var name = req.params.name;
	fs.mkdirSync(`projects/${name}`);

	var abbr = name.substring(0, 3);
	var data = JSON.stringify({name: `${name}`, text: `|snippet_${abbr}001|`});

	fs.appendFileSync(`projects/${name}/main_${name}`, data);
	fs.appendFileSync(`projects/${name}/${abbr}001.rgl`, '');
	var result = fs.readFileSync(`projects/${name}/main_${name}`, 'utf8');
	console.log(result);
	res.send('Done');
});

module.exports = router;