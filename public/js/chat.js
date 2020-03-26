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
var joined = false;
var chatUsers = [];
var username = 'unknown';
var userID = -1;
var roomName = "Room";
var lastMessageId = -1; // userid of last message sent

socket.on('userInfo', function(data) {
  userID = data.id;
  username = data.username;
  roomName = data.roomName;
  jQuery('#title').html(roomName);
  document.title = roomName + ' | CoronaChat';
  socket.emit('requestUserList', userID);
});

socket.on('responseUserAmount', function(data) {
  if (data != null) numberOfUsers.text(data + ' user' + ((data == 1)?'':'s') + ' online');
});

socket.on('connect', function() {
  if (!connected) {
    var params = jQuery.deparam(window.location.search);
    username = params.name;
    socket.emit('join', params, function(err) {
      if (err) {
        alert(err);
        window.location.href = '/';
      }
    });

    connected = true;

    setButton('Send');
  }
});

socket.on('disconnect', function() {
  createAlert('Lost connection to server :(');

  setButton('Offline');
  setStatus('Offline');
  disableSendButton();
  disableInput();

  setTimeout(function() { 
    createRefreshAlert('Reconnect'); 
    socket.connect();
  }, 1000);
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('HH:mm');
  var template;
  if (message.id === userID) {
    template = jQuery('#message-template-color').html();
    if (volume) audio.sent.play();
  } else if (lastMessageId != message.id) {
    template = jQuery('#message-template-username').html();
    if (!focused) audio.notification.play();
    else if (volume) audio.message.play();
  } else {
    template = jQuery('#message-template').html();
    if (!focused) audio.notification.play();
    else if (volume) audio.message.play();
  }

  lastMessageId = message.id;

  var html = Mustache.render(template, {
    text: message.text,
    from: message.from, 
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);

  scrollToBottom();
});

socket.on('newAlert', function (message) {
  createAlert(message.text);
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();
  disableSendButton();
  // sendStatus(userID, 'Online');
  setButton('Sending...');
  createMessage(username, userID, inputField.val());

  inputField.focus();   
  inputField.val('');
});

// Detect input changes in textfield, and set send-button to disabled or not
inputField.on('input', function(e) {
  if (sendEnabled && !isRealString(inputField.val())) {
    disableSendButton();
    // sendStatus(userID, 'Online');
  } else if (!sendEnabled && isRealString(inputField.val())) {
    enableSendButton();
    // sendStatus(userID, username + ' is typing...');
  }
});

socket.on('updateUserList', function(users) {
  chatUsers = users;

  if (userID != -1) {
    var status = jQuery('#status');

    status.html("");

    users.forEach(function (user, index, array) {
      // .html xss danger?
      if (user.id != userID) {
        status.html(status.html() + user.name + ', '); 
      }
    });

    status.html(status.html() + 'You');

    if (users.length > 1) {
      joined = true;
      overlay.hide();
      jQuery('#pop_waiting').hide();
      inputField.focus();  
      
      audio.join.play();    
      jQuery('#options').css("visibility", "visible");
    }
  }
});

socket.on('newStatus', function(status) {
  setStatus(status);
});

socket.on('userLeft', function(username) {
  createAlert(username + ' has left the chat.');

  setTimeout(function() {
    if (chatUsers.length <= 1) {
      createLeaveAlert('Go back to main page'); 
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
