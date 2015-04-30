/**
 * Created by Mark on 4/29/15
 */

		var items = 0,
            playing = 1,
            paused = true,
            isPlaying = false,
            playlistGUI = $("#playlistGUI ul"),
            songBuffer,
            startTime = 0,
            resumeTime = 0;


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
            	if(paused && !isPlaying)
            	{
                	beginPlaying();
                	$("#playIcon").removeClass("mdi-av-play-arrow").addClass("mdi-av-pause");
                }
                else if(paused && isPlaying)
            	{
                	resumePlaying();
                	$("#playIcon").removeClass("mdi-av-play-arrow").addClass("mdi-av-pause");
                }
                else
                {
                	pause();
            		$("#playIcon").removeClass("mdi-av-pause").addClass("mdi-av-play-arrow");
                }
                

                //playFromDB("ID SONG NAME"); //TODO: implement database driven playback
            }
        });
        
        function beginPlaying(thisSong) {
			loadSong(thisSong);
        }
        function beginPlaying() {
            songBuffer = playlist[playing-1].file;
			loadSong(songBuffer, 0);
			paused = false;
		}
		
		function resumePlaying() {
            songBuffer = playlist[playing-1].file;
		    loadSong(songBuffer, resumeTime);
			paused = false;

		}
        
        function playNext() {
        	playing++;
        	songBuffer = playlist[playing];
            beginPlaying(songBuffer);

			
			
        }
        
        function pause() {
  			source.stop(0);
			paused = true;
  			resumeTime = audioCtx.currentTime - startTime;
		}

        $("#forwardBtn").click(function () {
        	source.stop(0);
        	playNext();
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
            addSong(files[0], songName, artist);
        });

        function populatePlaylistDOM(song) {
            $("#playlistGUI").append('<li id="song' + (items - 1) + '"><div class="collapsible-header">' + song.title + ' - ' + song.artist + '</div><div class="collapsible-body"><p>Song Title: ' + song.title + '<br />Artist: ' + song.artist + '<br />Duration: <span id="duration' + (items - 1) + '"></span></p></div></li>');
        }

        function updateTotal() {
            items++;
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