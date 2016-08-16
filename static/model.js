//var fs = require('fs');

function Model() {
	var model = {};

	model.getInfo = function(url) {
	  return new Promise( (resolve, reject) => {

	    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
		var xhr = new XHR();

		xhr.open('GET', url, true);

		xhr.onload = function() {
	    	if (this.status == 200) {
	    		resolve(this.responseText);
	    	} else {
	    		var error = new Error(this.statusText);
	    		error.code = this.status;
	    		reject(error);
	    	}
	    };
			xhr.send();
	  });
	};

	model.postInfo = function(url, object) {

	  return new Promise( (resolve, reject) => {

	    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
		var xhr = new XHR();
		var bodyToSend = JSON.stringify(object);

		xhr.open('POST', url, true);
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

		xhr.onload = function() {
	    	if (this.status == 200) {
	    		resolve(this.responseText);
	    	} else {
	    		var error = new Error(this.statusText);
	    		error.code = this.status;
	    		reject(error);
	    	}
	    };
			xhr.send(bodyToSend);
	  });
	};

	model.delInfo = function(url, object) {

	  return new Promise( (resolve, reject) => {

	    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
		var xhr = new XHR();
		var bodyToSend = JSON.stringify(object);

		xhr.open('DELETE', url, true);
		xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');

		xhr.onload = function() {
	    	if (this.status == 200) {
	    		resolve(this.responseText);
	    	} else {
	    		var error = new Error(this.statusText);
	    		error.code = this.status;
	    		reject(error);
	    	}
	    };
			xhr.send(bodyToSend);
	  });
	};

	return model;
};