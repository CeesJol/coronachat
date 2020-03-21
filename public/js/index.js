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
    }

    prevData = data;

    document.getElementById('status').innerHTML = result;
  }
});