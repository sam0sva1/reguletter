var fs = require('fs');

var finder = {};

finder.toCreate = function (path, text) {
	var listOfFiles = fs.readdirSync(path);
	var regEx = /\|@[\wа-яА-Я]+@\|/g;
    var matching = text.match(regEx);
    if(matching) {
    	matching.forEach(snippetName => {
	    	var keyWord = snippetName.slice(2, -2);
	    	var sign = listOfFiles.indexOf(`${keyWord}.rgl`);
	    	if(sign == -1){
	    		fs.appendFileSync(`${path}/${keyWord}.rgl`, '__NEW_NOTE__');
	    		console.log(`New snippet (${keyWord}) created!`)
	    	}
    	});
    }
};

finder.toDelete = function() {
	
};

module.exports = finder;