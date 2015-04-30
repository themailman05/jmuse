var idbSupported = false,
	db;
 
document.addEventListener("DOMContentLoaded", function(){
 
    if("indexedDB" in window) {
        idbSupported = true;
    }
 
    if(idbSupported) {
        var openRequest = indexedDB.open("audioStorage",2);
 
        openRequest.onupgradeneeded = function(e) {
            console.log("Upgrading...");
            var localDB = e.target.result;
 
            if(!localDB.objectStoreNames.contains("songs")) {
                var store = localDB.createObjectStore("songs", {keyPath:'keyPath',
                    autoIncrement: true});
                store.createIndex('title', 'title', {unique: true});
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

 
	//create the song object and add song to database
    fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.onload = function(){
        console.log("FileReader output: " + fr.result);
        tempFile = fr.result;

        var transaction = db.transaction(["songs"],"readwrite");
        var store = transaction.objectStore("songs");

        var song = {
            title:title,
            artist:artist,
            file:tempFile
        };

        var request = store.add(song);

        request.onerror = function(e) {
            console.log("Error", e.target.error.name);
            //some type of error handler
        };

        request.onsuccess = function(e) {
            console.log("Song " + title + " successfully added.");
        };
    };
 


}

function getSongKeys() {
    songlist = [];

    var transaction = db.transaction(["songs"],"readonly");
    var store = transaction.objectStore("songs");
    store.index('title').openKeyCursor().onsuccess = function(evt){
        var cursor = evt.target.result;
        if (cursor) {
            songlist.push(cursor.key);
            cursor.continue();
        }
        else {
            for (ii = 0; ii<songlist.length; ii++){
                console.log("Song item: " + songlist[ii].toString());
            }
        }
    }; // here id is primary key path


};

function getSongMeta(key) {
    var transaction = db.transaction(["songs"],"readonly");
    var store = transaction.objectStore("songs");
    request = store.get(key);
    request.onsuccess = function(e){
        console.log("Result: " + e.result.toString());

    };
    request.onerror = function(e){
        console.log("OH FUCK COULDNT FIND THAT SHIT IN THE DB");
    };


};