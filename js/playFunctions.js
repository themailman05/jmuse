/**
 * Created by Mark on 4/29/15
 */

		var items = 0,
            playing = 1,
            playlistGUI = $("#playlistGUI ul"),
            time = new Date(),
            formattedTime = time.getHours() + ":" + time.getMinutes();

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
            $("#duration" + items).text(duration);

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
            else
            {
                if (player.paused) { //rewrite for WebAudio functions
                    player.src = playlist[playing];
                    //player.play();

                    songObject = getSong(1);

                    console.log("waiting for load");
                    loadSong(songObject.file);



                    $("#playIcon").removeClass("mdi-av-play-arrow").addClass("mdi-av-pause");

                    //playFromDB("ID SONG NAME"); //TODO: implement database driven playback
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
            addSong(files[0], songName, artist);
        });

        $('#player').on('ended', function () {
            playNext();
        });

        function addToPlaylist(song) {
            updateTotal();
            $("#playlistGUI").append('<li id="song' + items + '"><div class="collapsible-header">' + song.title + ' - ' + song.artist + '</div><div class="collapsible-body"><p>Song Title: ' + song.title + '<br />Artist: ' + song.artist + '<br />Duration: <span id="duration' + (items - 1) + '"></span></p></div></li>');
            playlist[items] = song;
        }

        function populatePlaylistDOM(song) {
            updateTotal();
            $("#playlistGUI").append('<li id="song' + items + '"><div class="collapsible-header">' + song.title + ' - ' + song.artist + '</div><div class="collapsible-body"><p>Song Title: ' + song.title + '<br />Artist: ' + song.artist + '<br />Duration: <span id="duration' + (items - 1) + '"></span></p></div></li>');
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
            getSongKeys();
            getSong(1);
            $("#playlistGUI").empty();
            items = 0;
            playing = 0;
            player.pause();
            $("#playIcon").removeClass("mdi-av-pause").addClass("mdi-av-play-arrow");
            player.src = "";
            playlist = [];

        }