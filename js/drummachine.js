window.onload = init();
var context;
var bufferLoader;


window.addEventListener('load',init,false);
function init() {
    try {
        var context;
        var bufferLoader;
        window.AudioContext =
            window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
        bufferLoader = new BufferLoader(
            context,
            [
                'https://dl.dropboxusercontent.com/u/5896300/Samples/kick.wav',
                'https://dl.dropboxusercontent.com/u/5896300/Samples/snare.wav',
                'https://dl.dropboxusercontent.com/u/5896300/Samples/hat.wav'
            ],
            finishedLoading
        );

        bufferLoader.load();
    }
    catch(e) {
        alert('Web Audio API is not supported in this browser');
    }

}


function playSound(buffer) {
    var source = context.createBufferSource(); // creates a sound source
    source.buffer = buffer;                    // tell the source which sound to play
    source.connect(context.destination);       // connect the source to the context's destination (the speakers)
    source.start(0);                           // play the source now
                                               // note: on older systems, may have to use deprecated noteOn(time);
}

function drumMachine(){
    init()

    var kick = bufferLoader.bufferList[0];
    var snare = bufferLoader.bufferList[1];
    var hat = bufferLoader.bufferList[2];
    var tempo = 120; //bpm
    var eighthNoteTime = (60/tempo)/2;
    var startTime = context.currentTime +.100;

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
}

// $(function(){
//    $('#clickme').click(function(){
//        $('#uploadme').click();
//    });
// }); 

function BufferLoader(context, urlList, callback) {
    this.context = context;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;

    request.onload = function() {
        // Asynchronously decode the audio file data in request.response
        loader.context.decodeAudioData(
            request.response,
            function(buffer) {
                if (!buffer) {
                    alert('error decoding file data: ' + url);
                    return;
                }
                loader.bufferList[index] = buffer;
                if (++loader.loadCount == loader.urlList.length)
                    loader.onload(loader.bufferList);
            },
            function(error) {
                console.error('decodeAudioData error', error);
            }
        );
    }

    request.onerror = function() {
        alert('BufferLoader: XHR error');
    }

    request.send();
}

BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}
