var socket = io({transports: ['websocket'], upgrade: false});

socket.emit('requestRoomInfo');

const MAX_USER_SIZE = 5; // duplicated at rooms.js

socket.on('responseRoomInfo', function(data) {
  // Reset table list
  jQuery('#rooms').html("");
  var index = 0;
  for (var room of data) {
    var template = jQuery('#room-template').html();
    if (room.users.length >= MAX_USER_SIZE) template = jQuery('#room-template-disabled').html();
    var html = Mustache.render(template, {
      id: room.id,
      name: room.name,
      online: room.users.length,
      class: (room.id == selectedRoom) ? 'selected' : 'x',
      number: ++index,
      maxUserSize: MAX_USER_SIZE
    });
    jQuery('#rooms').append(html);
  }
});