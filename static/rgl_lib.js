function RGL() {
	var rgl = {};

	rgl.projName_ = null;

	rgl.lstn = function(element, event, handler) {
		element.addEventListener(event, handler);
	};

	rgl.unlstn = function(element, event, handler) {
		element.removeEventListener(event, handler);
	};

	rgl.projPageList = function() {
		headerProjName.innerHTML = '';
		main_content.innerHTML = '';
		rgl.getMet('/projects').then(res => {
			let result = JSON.parse(res);
			result.forEach(item => {
				var element = rgl.projPageWrapProj(item);
				main_content.appendChild(element);
			});
		});
		home.classList.add('headTextZoom');
		rgl.unlstn(home, 'click', rgl.projPageList);
		rgl.lstn(main, 'click', rgl.projPageOnNameClickHandler);
		rgl.editPageSidebarClean_();
	};

	rgl.projPageWrapProj = function(projectName) {
		var element = document.createElement('div');
		element.innerHTML = projectName;
		element.setAttribute('data-proj', `${projectName}`);
		element.classList.add('project');
		element.classList.add('project_button');
		return element;
	};

	rgl.getMet = function(url) {
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

	rgl.postMet = function(url, text) {
	  return new Promise( (resolve, reject) => {

	    var XHR = ("onload" in new XMLHttpRequest()) ? XMLHttpRequest : XDomainRequest;
		var xhr = new XHR();
		var bodyToSend = JSON.stringify({"text": text});

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
	    	console.log(bodyToSend);
			xhr.send(bodyToSend);
	  });
	};

	rgl.projPageOnNameClickHandler = function(e) {
		var target = e.target;
		if(target.dataset.proj) {
			rgl.projName_ = target.dataset.proj;
			rgl.editPageBuild_(target);
		}
	};

	rgl.editPageBuild_ = function() {
		let url = `/projects/${rgl.projName_}/piece/merge`;
		rgl.getMet(url).then(res => {
			main_content.innerHTML = res;
			headerProjName.innerHTML = rgl.projName_;
		});
		rgl.lstn(home, 'click', rgl.projPageList);
		home.classList.remove('headTextZoom');
		rgl.editPageSidebarBuild_();
	};

	rgl.editPageSidebarBuild_ = function() {
		main.classList.remove('contentFullScreen');
		sideBar.style.display = 'block';
		let url = `/projects/${rgl.projName_}/piece`;
		rgl.getMet(url).then(res => {
			let result = JSON.parse(res);
			result.forEach(item => {
				sideBar.appendChild(rgl.editPagePieceButtonWrap_(item));
			});
		});
		rgl.lstn(sideBar, 'click', rgl.editPageOnPieceClickHandler);
	};

	rgl.editPagePieceButtonWrap_ = function(pieceName) {
		var pieceElem = document.createElement('div');
		pieceElem.innerHTML = pieceName;
		if(pieceName !== 'full') {
			pieceElem.setAttribute('data-piece', `${pieceName}`);
		} else {
			pieceElem.setAttribute('data-piece', 'merge');
		}
		
		pieceElem.classList.add('piece_button');
		return pieceElem;
	};

	rgl.editPageOnPieceClickHandler = function(e) {
		var target = e.target;
		if(target.dataset.piece) {
			rgl.editPagePieceContentRetrieve(target.dataset.piece);
		}
	};

	rgl.editPagePieceContentRetrieve = function(pieceName) {
		let url = `/projects/${rgl.projName_}/piece/${pieceName}`;
		rgl.getMet(url).then(res => {
			var prepearedText = rgl.editPagePieceWrap_(pieceName, res);
			rgl.editPageScreenFill_(main_content, prepearedText);
		});
	};

	rgl.editPagePieceWrap_ = function(pieceName, text) {
		console.log('pieceName', pieceName);
		var pieceElem = document.createElement('span');
		pieceElem.innerHTML = text;
		if(pieceName !== 'merge') {
			pieceElem.setAttribute('data-piece', `${pieceName}`);
			pieceElem.contentEditable = true;
			rgl.lstn(pieceElem, 'blur', rgl.editPageOnBlurHandler);
		} else {
			pieceElem.setAttribute('data-piece', '');
		}
		return pieceElem;
	};

	rgl.editPageOnBlurHandler = function(e) {
		var pieceName = e.target.dataset.piece;
		let url = `/projects/${rgl.projName_}/piece/${pieceName}`;
		var value = e.target.innerHTML;
		rgl.postMet(url, value);
	};

	rgl.editPageScreenFill_ = function(screen, content) {
		screen.innerHTML = '';
		screen.appendChild(content);
	};

	rgl.editPageSidebarClean_ = function(target) {
		sideBar.innerHTML = '';
		rgl.unlstn(sideBar, 'click', rgl.editPageOnPieceClickHandler);
		sideBar.style.display = 'none';
		main.classList.add('contentFullScreen');
	};

	return rgl;
};