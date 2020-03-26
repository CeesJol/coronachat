// if (isDeveloper()) {
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

  const AUDIO_LOCATION = '/./audio/25879__acclivity__drip1.wav';
  var audio = new Audio(AUDIO_LOCATION);

  // Play a sound if someone joins
  function playSound() {
    console.log('Someone joined the chat');
    audio.play();  
  }
// }

for (var i = 0; i < 3; i++) {
  var template = jQuery('#room-template').html();
  var html = Mustache.render(template, {

  });
  jQuery('#rooms').append(html);
}