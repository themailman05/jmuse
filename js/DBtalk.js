/**
 * Created by liam on 4/23/15.
 */
window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB,
    IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction,
    dbVersion = 1;

var db;

$(document).ready(function() {
    openDB();
    refreshPlaylist();

    var items = 0,
        playing = 0,
        playlist = [],
        player = $("#player").get(0),
        playlistGUI = $("#playlistGUI ul"),
        time = new Date(),
        formattedTime = time.getHours() + ":" + time.getMinutes(),
        duration,
        objectURL,
        fileName,
        fileType,
        db,
        fileSize;
    var dbname = "AudioDB";

    $("#temp").on("canplaythrough", function (e) {
        var seconds = e.currentTarget.duration;
        var duration = moment.duration(seconds, "seconds");

        var time = "";
        var hours = duration.hours();
        var minutes = duration.minutes();
        var seconds = duration.seconds();
        if (hours > 0) {
            time = hours + ":";
        }
        if (minutes == 0) {
            minutes = "00";
        }
        if (seconds < 10 && seconds != 0) {
            seconds = "0" + seconds;
        }
        else if (seconds == 0) {
            seconds = "00";
        }

        time = time + duration.minutes() + ":" + seconds;
        duration = time;
        $("#duration" + (items - 1)).text(duration);

        /*URL.revokeObjectURL(objectUrl);*/
    });
    /*var items = 0;
     var playing = 0;
     var playlist = [];
     var player = $("#player").get(0);
     var playlistGUI = $("#playlistGUI ul");
     var time = new Date();
     var formattedTime = time.getHours() + ":" + time.getMinutes();*/

    $('#addBtn').on('click', function (e) {
        e.preventDefault();
        $('#localFileDiag').trigger('click');
    });

    $("#playBtn").click(function () {
        if (items == 0) {
            alert("Playlist Empty");
        }
        else {
            if (player.paused) {
                player.src = playlist[playing];
                player.play();
                $("#playIcon").removeClass("mdi-av-play-arrow").addClass("mdi-av-pause");
                playFromDB("The Pot");
            }
            else {
                player.pause();
                $("#playIcon").removeClass("mdi-av-pause").addClass("mdi-av-play-arrow");
            }
        }
    });

    $("#clearBtn").click(function () {
        clearPlaylist();
    });

    $('.collapsible').collapsible({
        accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

    $('#localFileDiag').on('change', function (e) {

        var files = this.files;
        var file = URL.createObjectURL(files[0]);
        var songName = prompt("Song Title:");
        var artist = prompt("Artist:");
        addToPlaylist(file, songName, artist);
        $("#temp").prop("src", file);
        handleFileSelect(files[0], songName, artist);
    });

    function handleFileSelect(file, songName, artist) {
        console.log(file);
        fr = new FileReader();
        fr.readAsArrayBuffer(file);
        fr.onload = function(){
            console.log("FIleReader output: " + fr.result);
            writeToDB(fr.result, songName);

        };


    }


    $('#player').on('ended', function () {
        playNext();
    });

    function addToPlaylist(itemToAdd, songName, artist) {
        updateTotal();
        $("#playlistGUI").append('<li id="song' + (items - 1) + '"><div class="collapsible-header">' + songName + ' - ' + artist + '</div><div class="collapsible-body"><p>Song Title: ' + songName + '<br />Artist: ' + artist + '<br />Duration: <span id="duration' + (items - 1) + '"></span></p></div></li>');
        playlist[items - 1] = itemToAdd;
    }

    function updateTotal() {
        items++;
    }

    function playNext() {
        playing++;
        if (playing == items) {
            playing = 0;
        }

        player.src = playlist[playing];
        player.play();

    }

    function getTime() {
        return formattedTime;
    }

    function clearPlaylist() {
        $("#playlistGUI").empty();
        items = 0;
        playing = 0;
        player.pause();
        $("#playIcon").removeClass("mdi-av-pause").addClass("mdi-av-play-arrow");
        player.src = null;
        playlist = [];
    }

    function openDB() {
        if("indexedDB" in window) {
            idbSupported = true;
        }

        if(idbSupported) {
            var openRequest = indexedDB.open("audioFilesStore",1);

            openRequest.onupgradeneeded = function(e) {
                console.log("running onupgradeneeded");
                db = e.target.result;

                if(!db.objectStoreNames.contains("audioFiles")) {
                    db.createObjectStore("audioFiles");
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
    }
    function writeToDB(file1, songName) {
        var transaction = db.transaction(["audioFiles"],"readwrite");
        var store = transaction.objectStore("audioFiles");
        console.log(file1);
        var request = store.add(file1, songName);


        /*request.onsuccess = function (event) {
         db = event.target.result;
         console.log(db)
         var transaction = db.transaction("audioFiles",  "readwrite", 2000);
         transaction.oncomplete = function(){
         console.log("Success transaction");
         var trans = db.transaction("audioFiles", READ_WRITE);
         trans.objectStore("audioFiles").put(myArrayBuffer, "titleKey");
         };
         */



    }
    function playFromDB(songName) {
        var transaction = db.transaction(["audioFiles"], "readwrite");
        var store = transaction.objectStore("audioFiles");
        thesong = store.get(songName);
        thesong.onerror = function(event) {
            console.log("OH FUCK LOADING SHITS BROKE");
        };
        thesong.onsuccess = function(event) {
            // Do something with the request.result!
            alert("song retrieved: " + thesong.result.toString());
            console.log(thesong.result);

        };

    }

    function refreshPlaylist(){
        var transaction = db.transaction(["audioFiles"], "readwrite");
        var store = transaction.objectStore("audioFiles");
        objrequest = store.getAll();
        objrequest.onsuccess = function(e) {
            for (ii = 0; ii < request.result.length; ii++) {
                url = windows.url.createobjectURL(request.result);
                addToPlaylist(request.result, "textsong", "test");
            }
        };
    }


});