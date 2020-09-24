var Recording = function(cb){
  var recorder = null;
  var recording = true;
  var audioInput = null;
  var volume = null;
  var audioContext = null;
  var callback = cb;

  navigator.getUserMedia = navigator.getUserMedia    || navigator.webkitGetUserMedia ||
                           navigator.mozGetUserMedia || navigator.msGetUserMedia;

  if(navigator.getUserMedia){
    navigator.getUserMedia({audio:true},
      function(e){ //success
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
        volume = audioContext.createGain(); // creates a gain node
        audioInput = audioContext.createMediaStreamSource(e); // creates an audio node from the mic stream
        audioInput.connect(volume);// connect the stream to the gain node
        recorder = audioContext.createScriptProcessor(2048, 1, 1);

        recorder.onaudioprocess = function(e){
            if(!recording) {
              audioContext.suspend()
              recorder.disconnect(audioContext.destination)
              volume.disconnect(recorder)
              return
            }
            var left = e.inputBuffer.getChannelData(0);
            recording = callback(new Float32Array(left), audioContext.currentTime);
        };
        volume.connect(recorder);// connect the recorder
        recorder.connect(audioContext.destination);
      },
      function(e){ //failure
        alert('Error capturing audio.');
      }
    );
  } else {
    alert('getUserMedia not supported in this browser.');
  }
};

var lastClap = (new Date()).getTime();

function detectClap(data){
  var t = (new Date()).getTime();
  if(t - lastClap < 200) return false; // TWEAK HERE
  var zeroCrossings = 0, highAmp = 0;
  for(var i = 1; i < data.length; i++){
    if(Math.abs(data[i]) > 0.5) highAmp++; // TWEAK HERE
    if(data[i] > 0 && data[i-1] < 0 || data[i] < 0 && data[i-1] > 0) zeroCrossings++;
  }
  if(highAmp > 20 && zeroCrossings > 30){ // TWEAK HERE
    lastClap = t;
    return true;
  }
  return false;
}

export { Recording, detectClap }
