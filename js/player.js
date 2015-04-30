/**
 * Created by liam on 4/23/15.
 */


var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var source;
var freqDomain;



function loadSong(songBuffer, resumeTime){
    source = audioCtx.createBufferSource();

    audioCtx.decodeAudioData(songBuffer, function(buffer) {

        source.buffer = buffer;
        source.connect(audioCtx.destination);

        source.loop = false;
        isPlaying = true;

        source.start(resumeTime);
        visualize();
    });
    
	source.onended = function() {
		if(!paused)
		{
			console.log('Playing next song in queue.');
			isPlaying = false;
			playNext();
		}
	};

}	

function visualize(){
    var canvas = document.getElementById("viz");
    var canvasCtx = canvas.getContext("2d");
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
    analyser = audioCtx.createAnalyser();
    source.disconnect();
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftsize = 2048;
    var bufferLength = analyser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    analyser.getByteTimeDomainData(dataArray);

    function draw() {
        drawvisual = requestAnimationFrame(draw);
        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = 'rgb(255, 167, 38)';
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

}

