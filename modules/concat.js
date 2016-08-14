var fs = require('fs');

var concat = function(snippet, path) {
  var text = snippet;
  var reg = /\@\S+\@/;
	do {
    var matching = text.match(reg);
    if(matching){
      var keyWord = matching[0].slice(1, -1);
      var partToPass = concat(fs.readFileSync(`${path}/${keyWord}.rgl`, 'utf8'), path);
      var fullPiece = `<span id="${keyWord}" class="piece">${partToPass}</span>`;
      text = text.replace(matching, fullPiece);

    }
	} while (matching);
  return text;
};

module.exports = concat;