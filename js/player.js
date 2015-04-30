/**
 * Created by liam on 4/23/15.
 */


var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;
var freqDomain;

var canvas = document.querySelector('#viz');
var canvasCtx = canvas.getContext("2d");


function loadSong(songBuffer){
    source = audioCtx.createBufferSource();

    audioCtx.decodeAudioData(songBuffer, function(buffer) {

        source.buffer = buffer;
        source.connect(audioCtx.destination);
        source.loop = true;

        source.start(0);
    });
};

function visualize(){
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    analyzer = audioCtx.createAnalyzer();
    source.disconnect();
    source.connect(analyzer);
    analyzer.connect(audioCtx.destination);
    analyzer.fftsize = 2048;
    var bufferLength = analyzer.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    analyzer.getByteTimeDomainArray(dataArray);

    function draw() {
        drawvisual = requestAnimationFrame(draw);
        analyzer.getByteTimeDomainArray(dataArray);

        canvasCtx.fillstyle = 'rgb(255, 167, 38)';
        canvasCtx.fillRect(0,0,WIDTH,HEIGHT);

        canvasCtx.lineWidth =2;
        canvasCtx.strokeStyle= 'rgb(41,182,246)';

        canvasCtx.beginPath();

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT/2;

            if(i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(canvas.width, canvas.height/2);
        canvasCtx.stroke();
    };
    draw();

};

