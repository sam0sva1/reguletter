var home = document.getElementById('reguletter_logo');
var main = document.getElementById('main');
var main_content = document.getElementById('main_content');
var headerProjName = document.querySelector('.projectName');


function get(url) {
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
  })
};

function wrapProj(projectName) {
	var element = document.createElement('div');
	element.innerHTML = projectName;
	element.setAttribute('data-proj', `${projectName}`);
	element.classList.add('project');
	element.classList.add('button');
	return element;
};

function listProjs() {
	headerProjName.innerHTML = '';
	main_content.innerHTML = '';
	get('/projects').then(res => {
		let result = JSON.parse(res);
		console.log(result);
		result.forEach(item => {
			var element = wrapProj(item);
			main_content.appendChild(element);
		});

	});
};

listProjs();
home.onclick = listProjs;

var projectPageHandler = function(e) {
	var target = e.target;
	if(target.dataset.proj) {
		let projectName = target.dataset.proj;
		let url = `/projects/${projectName}/full`;
		get(url).then(res => {
			main_content.innerHTML = res;
			headerProjName.innerHTML = projectName;
		});
	}
};
main.addEventListener('click', projectPageHandler);