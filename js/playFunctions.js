/**
 * Created by Mark on 4/29/15
 */

		var items = 0,
            playing = 1,
            playlistGUI = $("#playlistGUI ul");


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

                var songObject = playlist[playing];
                var processed = processSong(songObject);
                beginPlaying(processed);

				processed.onended = function() {
					console.log('Playing next song in queue.');
					playNext();
				};

                $("#playIcon").removeClass("mdi-av-play-arrow").addClass("mdi-av-pause");

                //playFromDB("ID SONG NAME"); //TODO: implement database driven playback
            }
        });
        
        function processSong(thisSong) {
        	var newSong;
			setTimeout(function(){console.log("waiting for load"); newSong = loadSong(thisSong.file); }, 100);
			return newSong;
        }
        
        function beginPlaying(thisSong) {
            thisSong.start(0);
        }
        
        function playNext() {
        	playing++;
        	var songObject = playlist[playing];
            var processed = processSong(songObject);
            beginPlaying(processed);

			processed.onended = function() {
				console.log('Playing next song in queue.');
				playNext();
			};
        }

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
            addSong(files[0], songName, artist);
        });

        function populatePlaylistDOM(song) {
            $("#playlistGUI").append('<li id="song' + (items - 1) + '"><div class="collapsible-header">' + song.title + ' - ' + song.artist + '</div><div class="collapsible-body"><p>Song Title: ' + song.title + '<br />Artist: ' + song.artist + '<br />Duration: <span id="duration' + (items - 1) + '"></span></p></div></li>');
        }

        function updateTotal() {
            items++;
        }

        function playNext() {
            playing++;
            if (playing == (items-1)) {
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