var fs = require('fs');

var findName = function (path, text) {
	var listOfFiles = fs.readdirSync(path);
	var regEx = /\@\S+\@/g;
    var matching = text.match(regEx);
    if(matching) {
    	matching.forEach(snippetName => {
	    	var keyWord = snippetName.slice(1, -1);
	    	var sign = listOfFiles.indexOf(`${keyWord}.rgl`);
	    	if(sign == -1){
	    		fs.appendFileSync(`${path}/${keyWord}.rgl`, '__NEW_NOTE__');
	    		console.log(`New snippet (${keyWord}) created!`)
	    	}
    	});
    }
};

module.exports = findName;