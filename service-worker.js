// Bookmarks Organizer
// (c) 2013-2023 Jaseem V V. All rights reserved.

var BOOKMARKS_BAR_ID = '1',
    OTHER_BOOKMARKS_ID = '2',
    IS_IMPORT = 'isImport',
    reorderLookup = {};  // should reorder compute memoize

function setStorage(key, value, callback) {
    var o = {};
    o[key] = value;
    chrome.storage.local.set(o, callback);
}

function getStorage(key, callback) {
    chrome.storage.local.get(key).then(val => callback(val[key]));    
}

function removeStorage(key, callback) {
    chrome.storage.local.remove(key, callback);
}

// memoized lookup
function shouldReorder(moveInfo, orginalParentId, callback) {
    if (moveInfo.parentId == OTHER_BOOKMARKS_ID)  {
        reorderLookup[orginalParentId] = false;  // cache computed value
        callback(false);  // Ignore Other Bookmarks
        return;
    }
    if (moveInfo.parentId == BOOKMARKS_BAR_ID) {
        reorderLookup[orginalParentId] = true;  // cache computed value
        callback(true);  // Order if Bookmarks Bar
        return;
    }
    if (reorderLookup.hasOwnProperty(moveInfo.parentId)) {  // already computed
        callback(reorderLookup[moveInfo.parentId]);
        return;
    }
    getBookmarks(moveInfo.parentId, function(nodes) {
        shouldReorder(nodes[0], orginalParentId, callback);
    });
    
}

async function onMoved(id, moveInfo) {
    getStorage(IS_IMPORT, (isImport) => {
        if (!isImport) {
            shouldReorder(moveInfo, moveInfo.parentId, function(isReorder) {
                if (!isReorder) return;
                getBookmarks(moveInfo.parentId, function(nodes) {
                    if (nodes.length == 1 && nodes[0].hasOwnProperty('children')) {
                        sortByTitle(nodes[0].children, true);
                    }
                });
            });
        }
    });
}

function getBookmarks(id, callback) {
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
        if (folders[i].index != i) {  // avoid updating folders that are not changed
            folders[i].index = i;
            move(folders[i]);
        }
        // recursive is not used for auto sort because create or move is within a parent
        if (isRecursive && folders[i].hasOwnProperty('children') && folders[i].children.length > 0) {
            sortByTitle(folders[i].children, isRecursive);
        }
    }
    var idx = folders.length;
    for (var i = 0; i < leafs.length; i++, idx++) {
        if (leafs[i].index != i) {  // avoid updating bookmarks that are not changed
            leafs[i].index = idx;
            move(leafs[i]);    
        }
    }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == 'sort') {
        var nodes = getBookmarks(BOOKMARKS_BAR_ID, function(nodes) {
            sortByTitle(nodes, true);
            sendResponse('success');
        });
    }
    return true;
});

// Auto sort bookmarks on add or move
chrome.bookmarks.onCreated.addListener(onMoved);
chrome.bookmarks.onMoved.addListener(onMoved);

// Ignore bookmarks sorting on import
chrome.bookmarks.onImportBegan.addListener(function() {
    setStorage(IS_IMPORT, true);
});
chrome.bookmarks.onImportEnded.addListener(function() {
    removeStorage(IS_IMPORT);
});
