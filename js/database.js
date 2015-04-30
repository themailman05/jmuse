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
            var localDB = e.target.result;
 
            if(!localDB.objectStoreNames.contains("songs")) {
                var store = localDB.createObjectStore("songs", {keyPath:'keyPath',
                    autoIncrement: true});
                store.createIndex('title', 'title', {unique: true});
                store.createIndex('keyPath','keyPath', {unique: true});
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

function getSongs()
{
    songlist = [];

    var transaction = db.transaction(["songs"],"readonly");
    var store = transaction.objectStore("songs");
    store.index('title').openKeyCursor().onsuccess = function(evt){
        var cursor = evt.target.result;
        if (cursor) {
            songlist.push({title:cursor.key, artists:cursor.value.artist,
                file:URL.createObjectURL(cursor.value.file)});
            cursor.continue();
        }
        else {
            for (ii = 0; ii<songlist.length; ii++){
                console.log("Song item: " + songlist[ii].title.toString());

            }
        }
    }; // here id is primary key path


};