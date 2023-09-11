console.log("service-worker init");

function onCreated(id, moveInfo) {
    console.log('bookmarks created');
    console.log(moveInfo);
}

function onMoved(id, moveInfo) {
    console.log('bookmarks moved');
    console.log(moveInfo);
    getBookmarksSubTree(moveInfo.parentId, function(nodes) {
        console.log('nodes: %o', nodes);
        if (nodes.length == 1 && nodes[0].hasOwnProperty('children')) {
            sortByTitle(nodes[0].children, true);
        }
        
    });
}

function getAllBookmarks() {
    chrome.bookmarks.getTree(function(nodes) {
        console.log(nodes);
    });
}

function getBookmarksSubTree(id, callback) {
    chrome.bookmarks.getSubTree(id, callback);
}

function sort(a, b) {
    var aTitle = a.title.toLowerCase();
    var bTitle = b.title.toLowerCase();
    return aTitle < bTitle ? -1 : aTitle > bTitle ? 1 : 0;
}

function move(node) {
    chrome.bookmarks.move(node.id, {index: node.index, parentId: node.parentId});
}

function sortByTitle(nodes, isRecursive) {
    console.log(nodes);
    var folders = [];
    var leafs = [];
    for (n of nodes) {
        if (n.hasOwnProperty('children')) {
            folders.push(n);
        } else {
            leafs.push(n);
        }
    }
    leafs = leafs.sort(sort);
    folders = folders.sort(sort);
    for (var i = 0; i < folders.length; i++) {
        if (folders[i].index != i) {
            folders[i].index = i;
            move(folders[i]);
        }
        if (isRecursive && folders[i].hasOwnProperty('children') && folders[i].children.length > 0) {
            sortByTitle(folders[i].children, isRecursive);
        }
    }
    var idx = folders.length;
    for (var i = 0; i < leafs.length; i++, idx++) {
        if (leafs[i].index != i) {
            leafs[i].index = idx;
            console.log('index %d changed to %d', i, idx);
            move(leafs[i]);    
        }
    }
    console.log('folders: %o', folders);
    console.log('leafs: %o', leafs);
}


// getAllBookmarks();
getBookmarksSubTree('2094', function(nodes) {
    console.log('sub tree for 2094');
    console.log(nodes);
});

chrome.bookmarks.onCreated.addListener(onCreated);
chrome.bookmarks.onMoved.addListener(onMoved);
// TODO: import begin - don't sort
