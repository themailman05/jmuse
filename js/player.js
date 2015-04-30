/**
 * Created by liam on 4/23/15.
 */


var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;


function loadSong(songBuffer){
    source = audioCtx.createBufferSource();

    audioCtx.decodeAudioData(songBuffer, function(buffer) {

        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.loop = true;

        source.start(0);
    });
};