var socket = io();

socket.on('responseUserAmount', function(data) {
  if (data != null) {
    var appendix;
    if (data == 0) appendix = ' users online :(<br>Invite your friends!';
    else if (data == 1) appendix = ' user online';
    else appendix = ' users online';

    document.getElementById('status').innerHTML = data + appendix;
  }
});