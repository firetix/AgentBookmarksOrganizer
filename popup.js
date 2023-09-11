console.log("popup init");

document.addEventListener('DOMContentLoaded', function() {
	console.log('dom content loaded');
	var button = document.querySelector('.reorderBtn');
	button.onclick = function() {
		console.log('clicked');  
	};
});
