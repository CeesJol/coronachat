var socket = io({transports: ['websocket'], upgrade: false});

var prevData = -1;

socket.on('responseUserAmount', function(data) {
  if (data != null) {
    var appendix;
    if (data == 0) appendix = ' users online :(<br>Invite your friends!';
    else if (data == 1) appendix = ' user online';
    else appendix = ' users online';

    var result;
    if (prevData == data || prevData == -1) {
      result = data + appendix;
    } else if (data < prevData) {
      result = '<p style="color: red"><b>' + data + appendix + '</b></p>';
    } else {
      result = '<p style="color: green"><b>' + data + appendix + '</b></p>';
      playSound();
    }

    prevData = data;

    document.getElementById('status').innerHTML = result;
  }
});

// Play a sound if someone joins, only if you're a developer.
var developer = false;
function playSound() {
  if (developer) {
    console.log('Someone joined the chat');
    const AUDIO_LOCATION = '/./audio/25879__acclivity__drip1.wav';
    var audio = new Audio(AUDIO_LOCATION);
    audio.play();  
  }
}