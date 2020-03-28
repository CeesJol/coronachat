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
  if (roomId == selectedRoom) {
    unselectAll();
    selectedRoom = -1;
  } else {
    document.getElementById('room-name').value = roomId;
    unselectAll(); 
    document.getElementById('room-' + roomId).className += ' selected'; 
    selectedRoom = roomId;
  }
}