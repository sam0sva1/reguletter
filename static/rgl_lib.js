'use strict'

function RGL() {
	var rgl = {};

	rgl.projName_ = {
		real_name: null,
		work_name: null
	};

	rgl.projNameSetter = function(nameOfProj) {
		rgl.projName_.work_name = nameOfProj;
		var url = `/projects/${nameOfProj}/info`;
		m.getInfo(url).then(res => {
			var names = JSON.parse(res);
			rgl.projName_.real_name = names.real_name;
		});
	};

	rgl.lstn = function(element, event, handler) {
		element.addEventListener(event, handler);
	};

	rgl.unlstn = function(element, event, handler) {
		element.removeEventListener(event, handler);
	};

	rgl.buildButton = function(inner, class_1, opt_class_2) {
		var button = document.createElement('div');
		button.innerHTML = inner;
		button.classList.add(class_1);
		if(opt_class_2) {
			button.classList.add(opt_class_2);
		}
		return button;
	};

	rgl.buildInput = function(id, labelText) {
		var label = document.createElement('label');
		label.innerHTML = labelText + '</br>';
		var input = document.createElement('input');
		input.id = id;
		label.appendChild(input);
		return label;
	};

	rgl.projPageBuild = function() {
		rgl.cleanPage();
		rgl.projPageNewProjButtonBuild_();
		rgl.projPageList_();
	};

	rgl.projPageNewProjButtonBuild_ = function() {
		var newProjButton = rgl.buildButton('New Project', 'button', 'newProjButton');
		rgl.lstn(newProjButton, 'click', rgl.newProjPageCreateNewProject);
		main_control.appendChild(newProjButton);
	};

	rgl.newProjPageCreateNewProject = function() {
		rgl.projPageDestroy();
		rgl.newProjPageBuild_();
	};

	rgl.newProjPageBuild_ = function() {
		headerProjName.innerHTML = 'New Project';
		rgl.lstn(home, 'click', rgl.projPageBuild);
		var inputForRealName = rgl.buildInput('real_name', 'Название текста');
		var inputForWorkName = rgl.buildInput('work_name', 'Название проекта (одно ключевое слово на английском)');
		main_content.appendChild(inputForRealName);
		main_content.appendChild(inputForWorkName);

		rgl.newProjPageCreateButtonBuild_();
	};

	rgl.newProjPageCreateButtonBuild_ = function() {
		var newProjCreateButton = rgl.buildButton('Создать', 'button');
		rgl.lstn(newProjCreateButton, 'click', rgl.newProjPageCreateButtonOnClickHandler);
		main_control.appendChild(newProjCreateButton);
	};

	rgl.newProjPageCreateButtonOnClickHandler = function() {
		var real_name = document.getElementById('real_name');
		var work_name = document.getElementById('work_name');
		rgl.projName_.real_name = real_name.value;
		rgl.projName_.work_name = work_name.value;
		var createProjData = {"real_name": real_name.value, "work_name": work_name.value.toLowerCase()};
		m.postInfo('projects/create', createProjData);
		rgl.cleanPage();
		rgl.editPageBuild_();
	};

	rgl.cleanPage = function() {
		headerProjName.innerHTML = '';
		main_control.innerHTML = '';
		main_content.innerHTML = '';
		rgl.editPageDeleteButtonDestroy_();
	};

	rgl.projPageNewProjButtonDestroy_ = function() {
		main_control.innerHTML = '';
	};

	rgl.projPageList_ = function() {
		headerProjName.innerHTML = '';
		main_content.innerHTML = '';
		m.getInfo('/projects').then(res => {
			var result = JSON.parse(res);
			result.forEach(item => {
				var element = rgl.projPageWrapProj(item);
				main_content.appendChild(element);
			});
		});
		home.classList.add('headTextZoom');
		rgl.unlstn(home, 'click', rgl.projPageBuild);
		rgl.lstn(main, 'click', rgl.projPageOnNameClickHandler);
		rgl.editPageSidebarClean_();
	};

	rgl.projPageWrapProj = function(projectName) {
		var element = document.createElement('div');
		element.innerHTML = projectName;
		element.setAttribute('data-proj', `${projectName}`);
		element.classList.add('button');
		element.classList.add('project_button');
		return element;
	};

	rgl.projPageOnNameClickHandler = function(e) {
		var target = e.target;
		if(target.dataset.proj) {
			rgl.projNameSetter(target.dataset.proj);
			rgl.editPageBuild_(target);
		}
	};

	rgl.projPageDestroy = function() {
		rgl.projPageNewProjButtonDestroy_();
		home.classList.remove('headTextZoom');
		main_content.innerHTML = '';
	};

	rgl.editPageBuild_ = function() {
		rgl.projPageDestroy();
		rgl.editPageDeleteButtonBuild_();
		rgl.editPageFullTextConcat_();
		rgl.editPageSidebarBuild_();
		rgl.lstn(home, 'click', rgl.projPageBuild);
	};

//DELETE BUTTON SECTION START
	rgl.editPageDeleteButtonBuild_ = function() {
		rgl.lstn(header, 'mouseenter', rgl.editPageDelButShow);
		rgl.lstn(header, 'mouseleave', rgl.editPageDelButHide);
		delBut_wrapper.onclick = rgl.editPageOnDelButClickHandler;
	};

	rgl.editPageOnDelButClickHandler = function() {
		delBut_warning.innerHTML = 'ТОЧНО?';
  		delBut_warning.classList.add('deleteButtonWarningAnime');
  		delBut_finBut.classList.add('deleteButtonFinalDelAnime');
  		delBut_wrapper.onclick = '';
  
  		delBut_finBut.addEventListener('transitionend', function(){
    		delBut_finBut.onclick = function() {
      		rgl.editPageFinalProjectDelete();
      		delBut_warning.innerHTML = 'Удалить';
    		};
    		window.onclick = rgl.editPageOnAnythinkClickHandler;
  		});
	};

	rgl.editPageOnAnythinkClickHandler = function() {
		delBut_warning.innerHTML = 'Удалить';
      	delBut_finBut.classList.remove('deleteButtonFinalDelAnime');
      	delBut_warning.classList.remove('deleteButtonWarningAnime');
      	delBut_wrapper.onclick = rgl.editPageOnDelButClickHandler;
		window.onclick = '';
	};

	rgl.editPageFinalProjectDelete = function() {
		var url = `/projects/delete`;
		var objectToSend = rgl.projName_;
		m.delInfo(url, objectToSend).then(res => console.log(res));
		rgl.projPageBuild();
	};

	rgl.editPageDelButShow = function() {
		delBut_wrapper.classList.remove('hide');
	};

	rgl.editPageDelButHide = function() {
		delBut_wrapper.classList.add('hide');
		rgl.editPageOnAnythinkClickHandler();
	};

	rgl.editPageDeleteButtonDestroy_ = function() {
		rgl.unlstn(header, 'mouseenter', rgl.editPageDelButShow);
		rgl.unlstn(header, 'mouseleave', rgl.editPageDelButHide);
		delBut_wrapper.classList.add('hide');
	};
//DELETE BUTTON SECTION END

	rgl.editPageFullTextConcat_ = function() {
		main_content.innerHTML = '';
		var url = `/projects/${rgl.projName_.work_name}/piece/merge`;
		m.getInfo(url).then(res => {
			main_content.innerHTML = res;
			headerProjName.innerHTML = rgl.projName_.real_name;
		});
	};

	rgl.editPageSidebarBuild_ = function() {
		main.classList.remove('contentFullScreen');
		sideBar.style.display = 'block';
		rgl.editPageSidebarRefresh_();
		rgl.lstn(sideBar, 'click', rgl.editPageOnPieceClickHandler);
	};

	rgl.editPageSidebarRefresh_ = function() {
		var url = `/projects/${rgl.projName_.work_name}/piece`;
		m.getInfo(url).then(res => {
			sideBar.innerHTML = '';
			var result = JSON.parse(res);
			result.forEach(item => {
				sideBar.appendChild(rgl.editPagePieceButtonWrap_(item));
			});
		});
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
		var url = `/projects/${rgl.projName_.work_name}/piece/${pieceName}`;
		m.getInfo(url).then(res => {
			var prepearedText = rgl.editPagePieceWrap_(pieceName, res);
			main_control.innerHTML = (pieceName !== 'merge') ? `<span>${pieceName}</span>` : `<span>Компазит</span>`;
			rgl.editPagePieceDelButBuild();
			rgl.editPageScreenFill_(main_content, prepearedText);
		});
	};

	rgl.editPagePieceDelButBuild = function() {
		var pieceDelBut = rgl.buildButton('Удалить', 'button', 'pieceDelBut');
		main_control.appendChild(pieceDelBut);
	}

	rgl.editPagePieceWrap_ = function(pieceName, text) {
		var pieceElem = document.createElement('span');
		pieceElem.innerHTML = text;
		if(pieceName !== 'merge') {
			pieceElem.setAttribute('data-piece', `${pieceName}`);
			pieceElem.contentEditable = true;
			rgl.lstn(pieceElem, 'blur', rgl.editPageOnTextBlurHandler);
		} else {
			pieceElem.setAttribute('data-piece', '');
		}
		return pieceElem;
	};

	rgl.editPageOnTextBlurHandler = function(e) {
		var pieceName = e.target.dataset.piece;
		var url = `/projects/${rgl.projName_.work_name}/piece/${pieceName}`;
		var value = e.target.innerHTML;
		var objectToSend = {"text": `${value}`}
		m.postInfo(url, objectToSend);
		rgl.editPageSidebarRefresh_();
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