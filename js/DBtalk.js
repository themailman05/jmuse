/**
 * Created by liam on 4/23/15.
 */
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
    IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
    dbVersion = 1;

var db; //initialize db in wide scope

document.addEventListener("DOMContentLoaded", function() {

    if ("indexedDB" in window) {  //determine if indexedDB is supported
        idbSupported = true;
    }

    /*******************************************************************
     * This block opens up the indexedDB named audioFilesStore,
     * handles version upgrading if needed, and creates object store.
     * onsuccess should pass the db object along to the wide scope DB
     * variable.
     */
    if (idbSupported) {
        var openRequest = indexedDB.open("audioFilesStore", 1);

        openRequest.onupgradeneeded = function (e) {
            console.log("running onupgradeneeded");
            var thisDB = e.target.result;
            if (!thisDB.objectStoreNames.contains("audioFiles")) {
                thisDB.createObjectStore("audioFiles");
            }

        };

        openRequest.onsuccess = function (e) {
            db = e.target.result;
            console.log("Success!");
        };

        openRequest.onerror = function (e) {
            console.log("Error");
            console.dir(e);
        };

    }


    /************************************************************************
     * This function writes an ArrayBuffer (of an audio file) to the indexedDB
     * open in the current session.
     * @param file1 - The ArrayBuffer of an audio file you wish to store
     * @param songName - The name of the song to be used as a key in the iDB.
     */
    function writeToDB(file1, songName) {
        var transaction = db.transaction(["audioFiles"], "readwrite");
        var store = transaction.objectStore("audioFiles");
        console.log(file1);
        var request = store.add(file1, songName);

    }

    function playFromDB(songName) {
        getSongs();
        var transaction = db.transaction(["audioFiles"], "readonly");
        var store = transaction.objectStore("audioFiles");
        thesong = store.get(songName);
        thesong.onerror = function (event) {
            console.log("OH FUCK LOADING SHITS BROKE");
        };
        thesong.onsuccess = function (event) {
            // Do something with the request.result!
            alert("song retrieved: ");
            console.log(thesong.result);

        };

    }

    function refreshPlaylist() {
        var transaction = db.transaction(["audioFiles"], "readonly");
        var store = transaction.objectStore("audioFiles");
        objrequest = store.indexNames;
        objrequest.onsuccess = function (e) {
            console.log("playlist names: " + objrequest.result.toString());
        };
    }

},false);