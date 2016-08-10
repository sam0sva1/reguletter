var fs = require('fs');

var concat = function(snippet, path) {
  var text = snippet;
  var reg = /<snippet_[\w]*>/;
	do {
    var matching = text.match(reg);
    if(matching){
      var keyWord = matching[0].substr(9, 6);
      var partToPass = concat(fs.readFileSync(`${path}/${keyWord}.rgl`, 'utf8'), path);
      var fullPiece = `<span class="${keyWord} piece" contenteditable>${partToPass}</span>`;
      text = text.replace(matching, fullPiece);

    }
	} while (matching);
  return text;
};

module.exports = concat;