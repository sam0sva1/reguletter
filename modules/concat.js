var fs = require('fs');
var finder = require('./finder.js');

var concat = function(snippet, path) {
  var text = snippet;
  finder.toCreate(path, text);

  var regEx = /\|@[\wа-яА-Я]+@\|/;
	do {
    var matching = text.match(regEx);
    if(matching){
      var keyWord = matching[0].slice(2, -2);
      var episode = fs.readFileSync(`${path}/${keyWord}.rgl`, 'utf8');
      var partToPass = concat(episode, path);
      var fullPiece = `<span id="${keyWord}" class="piece">${partToPass}</span>`;
      text = text.replace(matching, fullPiece);
    }
	} while (matching);
  return text;
};

module.exports = concat;