var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var router = express.Router();
var concat = require('../modules/concat.js');
var finder = require('../modules/finder.js');

var jsonParser = bodyParser.json();

router.get('/', function(req, res) {
	var name = req.params.name;
	var listToSend = [];
	var listOfProjects = fs.readdirSync(`projects`);
	listOfProjects.forEach((projName, i, arr) => {
		if(projName.indexOf(".")) {
			listToSend.push(projName);
		}
	});
	res.send(listToSend);
});

router.get('/:name/piece', function(req, res) {
	var name = req.params.name;
	var pieceArray = ['full'];
	var listOfFiles = fs.readdirSync(`projects/${name}`);
	listOfFiles.forEach((fileName, i, arr) => {
		if(fileName.indexOf("main") === -1) {
			var sliced = fileName.slice(0, -4);
			pieceArray.push(sliced);
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

router.delete('/:name/piece/delete', jsonParser, function(req, res) {
	var piceName = req.body.pieceName;
	var listOfFiles = fs.readdirSync(`projects/${work_name}`);
	listOfFiles.forEach(item => {

	});
});

router.get('/:name/piece/:piece', function(req, res) {
	var params = req.params;
	var piece = fs.readFileSync(`projects/${params.name}/${params.piece}.rgl`, 'utf8');
	res.send(piece);
});

router.get('/:name/info', function(req, res) {
	var name = req.params.name;
	var info = fs.readFileSync(`projects/${name}/main_${name}.rgl`, 'utf8');
	res.send(info);
});

router.post('/:name/piece/:piece', jsonParser, function(req, res) {
	var name = req.params.name;
	var piece = req.params.piece;
	var text = req.body.text;

	var path = `projects/${name}`;
	finder.toCreate(path, text);

	fs.writeFileSync(`projects/${name}/${piece}.rgl`, text, 'utf8');

	var body = fs.readFileSync(`projects/${name}/${piece}.rgl`, 'utf8');
	res.send('Snippet saved.');
});

router.post('/create', jsonParser, function(req, res) {	
	var real_name = req.body.real_name;
	var work_name = req.body.work_name;
	fs.mkdirSync(`projects/${work_name}`);

	var abbr = work_name.substring(0, 3);
	var dataToMainFile = JSON.stringify({real_name: `${real_name}`, work_name: `${work_name}`, text: `|@${abbr}001@|`});
	fs.appendFileSync(`projects/${work_name}/main_${work_name}.rgl`, dataToMainFile);

	var dataTo001 = '>001<';
	fs.writeFileSync(`projects/${work_name}/${abbr}001.rgl`, dataTo001, 'utf8');
	var result = fs.readFileSync(`projects/${work_name}/main_${work_name}.rgl`, 'utf8');
	console.log(`Project was created! Work name: ${work_name}`);
	res.send('Done');
});

router.delete('/delete', jsonParser, function(req, res) {	
	var work_name = req.body.work_name;
	var listOfFiles = fs.readdirSync(`projects/${work_name}`);
	listOfFiles.forEach(item => fs.unlinkSync(`projects/${work_name}/${item}`));
	fs.rmdirSync(`projects/${work_name}`);
	console.log(`Project ${work_name} was deleted.`);
	res.send(`Project ${work_name} was deleted`);
});

module.exports = router;
