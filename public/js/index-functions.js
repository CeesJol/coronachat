/**
 * Return true if window location parameter developer is true
 */
function isDeveloper() {
  return window.location.search.includes("developer=true");
}

var selectedRoom = -1;

function unselectAll() {
  for (var row of document.getElementById("rooms").rows) {
    row.removeAttribute('class');
  }
}

function selectRoom(roomId) {
  unselectAll();
  if (roomId == selectedRoom) {
    document.getElementById('room-name').value = '';
    selectedRoom = -1;
  } else {
    document.getElementById('room-name').value = roomId;
    document.getElementById('room-' + roomId).className += ' selected'; 
    selectedRoom = roomId;
  }
}

jQuery('#form').submit(function() {
  if (selectedRoom == -1) {
    for (var room of rooms) {
      if (room.users.length < room.maxSize) {
        selectRoom(room.id);
        return;
      }
    }
  }
});