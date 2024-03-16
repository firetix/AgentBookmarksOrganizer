## Bookmarks Organizer Browser Extension
v4.1.0

Bookmarks Organizer helps in keeping the bookmarks sorted. It monitors for newly added or moved bookmarks and auto arranges them in ascending order by title. There is a reorder button to manually order the bookmarks in the Bookmarks Bar which can be used initially after installation.

Only bookmarks in the Bookmarks Bar/Favourites Bar are sorted. If you want to have a custom order, those bookmarks can be placed inside the Other Bookmarks/Other Favourites.


#### Limitations

- There are max write limits set by the browser so that the sync servers are not abused. So only a certain number of move operations can be performed per session in a given interval of time.

#### Install

[Chrome](https://chrome.google.com/webstore/detail/bookmarks-organizer/cjdenbocfdbjohomdaojaokiffjbnaca)  
[Edge](https://microsoftedge.microsoft.com/addons/detail/bookmarks-organizer/aikhdahlgpnahmekepldbjjfobjhbhna)

#### Change Logs

##### Version 4.1.1

- Memoize should reorder computation to improve performance

##### Version 4.1.0

- Ignore auto sorting Other Bookmarks/Other Favourites

##### Version 4.0.0

- Upgrade to manifest v3 and rewrite to use service worker and popup script

##### Version 3.0.0

- Add back event listeners

##### Version 2.0.8

- Fix cycling of bookmarks if title is empty

##### Version 2.0.6

- Memory optimization: removed script loading via xhr and eval which reduces the bookmark object to just one.
- Removed content security policy which reverts it to default.
- Added offline flag.

##### Version 2.0.3

- Made improvements to the sorting algorithm, so that when a node is added, it sorts the whole list to which the node is added, but only updates the node and the ones after it. This reduces the number of move API calls, leaving room for more operation before the max write limit is reached.
