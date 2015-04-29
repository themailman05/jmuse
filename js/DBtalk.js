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
            fileSize;

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
                    playFromDB("ID SONG NAME"); //TODO: implement database driven playback
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
            refreshPlaylist();
            //player.src = null;
            playlist = [];

        }



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