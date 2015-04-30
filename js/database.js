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
                    {keyPath: 'title', autoIncrement: false});
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

 
	//create the song object and add song to database
    fr = new FileReader();
    fr.readAsArrayBuffer(file);
    fr.onload = function(){
        console.log("FileReader output: " + fr.result);
        tempFile = fr.result;

        theblob = new Blob([tempFile], {type: "audio/mp3"});

        var song = {
            title:title,
            artist:artist,
            file:theblob
        };

        var transaction = db.transaction(["songs"],"readwrite");
        var store = transaction.objectStore("songs", 1);

        var request = store.add(song);

        request.onerror = function(e) {
            console.log("Error", e.target.error.name);
            //some type of error handler
        };

        request.onsuccess = function(e) {
            console.log("Song " + title + " successfully added.");
            i++;
        };
    };
 


}