var context;
var sampleBuffer = new Array(3);
var sampleUrls = new Array(3);
sampleUrls[0] = 'https://dl.dropboxusercontent.com/u/5896300/Samples/kick.wav'
sampleUrls[1] = 'https://dl.dropboxusercontent.com/u/5896300/Samples/snare.wav'
sampleUrls[2] = 'https://dl.dropboxusercontent.com/u/5896300/Samples/hat.wav'

window.addEventListener('load',init,false);
function init() {
    try {
        window.AudioContext =
            window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
    }

}

function loadSample(url, targetBuffer) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';

    //asynch decode
    request.onload = function() {
        context.decodeAudioData(request.response, function (buffer) {
            targetBuffer = buffer;
        }, onError);
    }
    request.send();
}

function loadSamples(){
    for(var ii=0; ii<sampleUrls.length; ii++){
        loadSample(sampleUrls[ii], sampleBuffer[ii])
    }
}
function playSound(buffer) {
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
                                               // note: on older systems, may have to use deprecated noteOn(time);
}

var kick = sampleBuffer[0];
var snare = sampleBuffer[1];
var hat = sampleBuffer[2];
var tempo = 120; //bpm
var eighthNoteTime = (60/tempo)/2;
var startTime = context.currentTime +.100;

loadSamples();

for (var bar = 0; bar < 2; bar++) {
    var time = startTime + bar * 8 * eighthNoteTime;
    playSound(kick, time);
    playSound(kick, time + 4 * eighthNoteTime);

    playSound(snare, time + 2 * eighthNoteTime);
    playSound(snare, time + 6 * eighthNoteTime);

    for (var i = 0; i < 8; ++i) {
        playSound(hat + time + i * eighthNoteTime);
    }
}