var idbSupported = false,
	db;
 
document.addEventListener("DOMContentLoaded", function(){
 
    if("indexedDB" in window) {
        idbSupported = true;
    }
 
    if(idbSupported) {
        var openRequest = indexedDB.open("audioStorage",1);
 
        openRequest.onupgradeneeded = function(e) {
            console.log("Upgrading...");
            var db = e.target.result;
 
            if(!db.objectStoreNames.contains("songs")) {
                store = db.currentTarget.result.createObjectStore("songs",
                    {keyPath: 'id', autoIncrement: true});
                store.createIndex('title', 'title', {unique: false});
            }
 
        };
 
        openRequest.onsuccess = function(e) {
            console.log("Success!");
            db = e.target.result;
        };
 
        openRequest.onerror = function(e) {
            console.log("Error");
            console.dir(e);
        };
 
    }
 
},false);

function addSong(file, title, artist)
{
    var tempFile;

    console.log("About to add "+title+"/"+artist);
    	fr = new FileReader();

        fr.readAsArrayBuffer(file);
        fr.onload = function(){
        	console.log("FIleReader output: " + fr.result);
            tempFile = fr.result;
		};

    
    var transaction = db.transaction(["songs"],"readwrite");
    var store = transaction.objectStore("songs", 1);
 
	//create the song object
    var song = {
        title:title,
        artist:artist,
        file:tempFile
    };
 
 	//add song to database
    var request = store.add(song, {keyPath: 'id', autoIncrement: true});
    
    request.onerror = function(e) {
        console.log("Error", e.target.error.name);
    };
 
    request.onsuccess = function(e) {
        console.log("Song " + title + " successfully added.");
    };
}