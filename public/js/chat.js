var socket = io();
var username = 'unknown';
var userID = -1;
var sendButton = jQuery('#send-button');
sendButton.attr('disabled', 'disabled');
var messageTextbox = jQuery('[name=message]');
var sendEnabled = false;
var overlay = jQuery('#overlay');
var inputField = jQuery('#chat-message'); // same as messageTextbox? TODO
var chatUsers;
var connected = false;

socket.on('userInfo', function(data) {
  userID = data.id;
  username = data.username;
  console.log('my id is ' + userID, 'my name is ' + username);
  socket.emit('requestUserList', userID);
});

socket.on('connect', function() {
  if (!connected) {
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

    setButton('Send');
  }
});

socket.on('disconnect', function() {
  createAlert('Lost connection to server :(');
  scrollToBottom();

  console.log('Disconnected from server');

  setButton('Offline');
  disableSendButton();
  disableInput();
  setStatus('Offline');

  setTimeout(function() { 
    createRefreshAlert('Reconnect'); 
  }, 1000);

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
  scrollToBottom();
});

jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  disableSendButton();
  sendStatus(userID, 'Online');

  setButton('Sending...');

  // focus on input area
  inputField.focus();   

  createMessage(username, userID, messageTextbox.val());

  // clear input area
  messageTextbox.val('');
});

// Detect input changes in textfield, and set send-button to disabled or not
messageTextbox.on('input', function(e) {
  if (sendEnabled && !isRealString(messageTextbox.val())) {
    disableSendButton();
    sendStatus(userID, 'Online');
  } else if (!sendEnabled && isRealString(messageTextbox.val())) {
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
        title.html(user.name);
        createAlert('Now chatting with ' + user.name);
      }
    });

    if (users.length > 1) {
      overlay.hide();

      // focus on input area
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

