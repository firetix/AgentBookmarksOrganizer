// Bookmarks Organizer
// (c) 2013-2023 Jaseem V V. All rights reserved.

document.addEventListener('DOMContentLoaded', function() {
	var button = document.querySelector('.reorderBtn');
	var status = document.querySelector('.statusTxt');
	button.onclick = function() {
		displayInProgress();
		chrome.runtime.sendMessage({ 
        	message: "sort"
    	}, function(response) {
    		console.log(response);
        	if (response === 'success') {
            	removeInProgress();
        	}
    	});
	};

	function displayInProgress() {
        button.style.display = 'none';
        status.innerHTML = 'Reorder in progress';
        status.style.display = 'block';
    }

	function removeInProgress() {
		status.style.display = 'none';
		button.style.display = 'block';
	}
});
