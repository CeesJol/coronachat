var socket = io();

// Frequently used elements
var sendButton = jQuery('#send-button');
    sendButton.attr('disabled', 'disabled');
var overlay = jQuery('#overlay');
var inputField = jQuery('#chat-message');
var numberOfUsers = jQuery('#numberOfUsers');

// Page-specific variables and constants
var sendEnabled = false;
const AUDIO_LOCATION = '/./audio/zapsplat_household_portable_light_switch_plastic_off_43559.mp3';
var audio = new Audio(AUDIO_LOCATION);

// Connection variables
var connected = false;
var chatUsers = [];
var username = 'unknown';
var userID = -1;

socket.on('userInfo', function(data) {
  userID = data.id;
  username = data.username;
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
  }, 1000);

  // Don't reconnect anymore
  socket.disconnect();
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('HH:mm');
  var template;
  if (message.id === userID) {
    template = jQuery('#message-template-color').html();
  } else {
    template = jQuery('#message-template').html();
  }

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
  sendStatus(userID, 'Online');
  setButton('Sending...');
  createMessage(username, userID, inputField.val());

  inputField.focus();   
  inputField.val('');
});

// Detect input changes in textfield, and set send-button to disabled or not
inputField.on('input', function(e) {
  if (sendEnabled && !isRealString(inputField.val())) {
    disableSendButton();
    sendStatus(userID, 'Online');
  } else if (!sendEnabled && isRealString(inputField.val())) {
    enableSendButton();
    sendStatus(userID, username + ' is typing...');
  }
});

socket.on('updateUserList', function(users) {
  chatUsers = users;

  if (userID != -1) {
    var title = jQuery('#title');

    users.forEach(function (user) {
      if (user.id != userID) {
        title.html(user.name); // .html xss danger?
        createAlert('Now chatting with ' + user.name);
        audio.play();    
        document.title = user.name + ' | CoronaChat';
      }
    });

    if (users.length > 1) {
      overlay.hide();
      inputField.focus();      
    }
  }
});

socket.on('newStatus', function(status) {
  setStatus(status);
});

socket.on('userLeft', function(username) {
  createAlert(username + ' has left the chat.');

  setTimeout(function() { 
    createRefreshAlert('Search for another stranger'); 
  }, 1000);
});

