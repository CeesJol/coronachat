var socket = io({transports: ['websocket'], upgrade: false});

// Frequently used elements
var sendButton = jQuery('#send-button');
    sendButton.attr('disabled', 'disabled');
var overlay = jQuery('#overlay');
var inputField = jQuery('#chat-message');
var numberOfUsers = jQuery('#numberOfUsers');

// Page-specific variables
var sendEnabled = false;
var focused = true; // true if browser window if focused, false otherwise

// Audio
const AUDIO_LOCATION = '/./audio/zapsplat_household_portable_light_switch_plastic_off_43559.mp3';
const AUDIO_NOTIFICATION_LOCATION = '/./audio/26777__junggle__btn402.mp3';
const AUDIO_MESSAGE_LOCATION = '/./audio/zapsplat_multimedia_button_press_plastic_click_002_36869.mp3';
const AUDIO_MESSAGE_SENT_LOCATION = '/./audio/zapsplat_multimedia_button_press_plastic_click_003_36870.mp3';

var audio = {
  join: new Audio(AUDIO_LOCATION),
  notification: new Audio(AUDIO_NOTIFICATION_LOCATION),
  message: new Audio(AUDIO_MESSAGE_LOCATION),
  sent: new Audio(AUDIO_MESSAGE_SENT_LOCATION)
}

// Connection variables
var connected = false;
var sendingMessage = false;
var joined = false;
var chatUsers = [];
var username = 'onbekend';
var userID = -1;
var roomName = "Kamer";
var lastMessageId = -1; // userid of last message sent
var admin = false;

socket.on('userInfo', function(data) {
  userID = data.id;
  username = data.username;
  roomName = data.roomName;
  jQuery('#title').html(roomName);
  document.title = roomName + ' | SeniorenChat';
  socket.emit('requestUserList', userID);
});

socket.on('responseUserAmount', function(data) {
  if (data != null) numberOfUsers.text(data + ((data == 1)?' iemand':' mensen') + ' online');
});

socket.on('connect', function() {
  console.log('Connected to server');

  var params = jQuery.deparam(window.location.search);
  username = params.name;
  socket.emit('join', params, function(err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    }
  });

  connected = true;

  updateFooter();
});

socket.on('disconnect', function() {
  createAlert('Verbinding verloren :(');

  connected = false;
  
  updateFooter();

  setTimeout(function() { 
    if (!connected) {
      createRefreshAlert('Opnieuw verbinden'); 
    }
  }, 1000);
});

socket.on('newMessage', function (message) {
  drawMessage(message.from, message.id, message.text, message.createdAt);
});

function requestAdmin(password) {
  socket.emit('requestAdmin', {
    password: password,
  }, function(err) {
    if (err) {
      console.log('Admin request denied:\n' + err);
    } else {
      console.log('You are now admin');
      admin = true;
      jQuery('#header').css('background', 'red');
    }
  });  
}
var adm = {
  kickUser: function(socketId) {
    socket.emit('adminKickUser', socketId, function(err) {
      if (err) {
        console.log('User kick denied:\n' + err);
      } else {
        console.log('User is kicked');
        admin = true;
      }
    });
  },
  shadowBan: function(socketId) {
    socket.emit('adminShadowBanUser', socketId, function(err) {
      if (err) {
        console.log('User shadow ban denied:\n' + err);
      } else {
        console.log('User is now shadow banned');
        admin = true;
      }
    });
  }
}

socket.on('newAlert', function (message) {
  createAlert(message.text);
});

jQuery('#message-form').on('submit', function(e) {
  sendingMessage = true;
  updateFooter();
  e.preventDefault();
  createMessage(username, userID, inputField.val());

  inputField.focus();   
  inputField.val('');
});

// Detect input changes in textfield, and set send-button to disabled or not
inputField.on('input', function(e) {
  updateFooter();
});

socket.on('updateUserList', function(users) {
  chatUsers = users;

  if (userID != -1) {
    createUserList(users);

    if (users.length > 1) {
      joined = true;
      overlay.hide();
      jQuery('#pop_waiting').hide();
      inputField.focus();  
      
      if (volume) audio.join.play();    
      jQuery('#options').css("visibility", "visible");
    }
  }
});

socket.on('newStatus', function(status) {
  if (status == 'Online') {
    setStatus(createUserList(chatUsers));
  } else {
    setStatus(status);
  }
});

socket.on('userLeft', function(username) {
  createAlert(username + ' heeft de chat verlaten');

  setTimeout(function() {
    if (chatUsers.length <= 1) {
      createLeaveAlert('Ga terug naar de hoofdpagina'); 
    }
  }, 1000);
});

// Button to leave the chat, opens the confirmation popup
jQuery('#leave-option').click(function(){
  overlay.show();
  jQuery('#pop_leave').show();
});

// Leave the chat
jQuery('#leave-button').click(function(){
  window.location.href = "../index.html";
});

// Remove popup
jQuery('#cancel-button').click(function(){
  overlay.hide();
});

// When clicked on the overlay, hide it only if user is not waiting for a chat partner
overlay.click(function() {
  if (joined) overlay.hide();
});

jQuery('#pop_leave').click(function() {
  return false;
});

window.onfocus = function() {
    focused = true;
};
window.onblur = function() {
    focused = false;
};
