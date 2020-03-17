var socket = io();
var username = 'unknown';
var userID = -1;

function scrollToBottom() {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');

  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

socket.on('playerInfo', function(data) {
  userID = data.id;
  username = data.username;
  console.log('my id is ' + userID, ' my name is ' + username);
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

  setStatus('Online');
});

socket.on('disconnect', function() {
  console.log('Disconnected to server');

  setStatus('Offline');
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
  var formattedTime = moment(message.createdAt).format('HH:mm');

  var template = jQuery('#alert-template').html();

  var html = Mustache.render(template, {
    text: message.text
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

var sendButton = jQuery('#send-button');
sendButton.attr('disabled', 'disabled');
var messageTextbox = jQuery('[name=message]');
var sendEnabled = false;
jQuery('#message-form').on('submit', function(e) {
  e.preventDefault();

  disableSendButton();

  setStatus('Sending message...');

  socket.emit('createMessage', {
    from: username,
    fromID: userID,
    text: messageTextbox.val()
  }, function() {
    messageTextbox.val('');
    setStatus('Online');
  });
});

// Detect input changes in textfield, and set send-button to disabled or not
messageTextbox.on('input', function(e) {
  if (sendEnabled && messageTextbox.val() == '') {
    disableSendButton();
  } else if (!sendEnabled && messageTextbox.val() !== '') {
    enableSendButton();
  }
});

function disableSendButton() {
  sendButton.attr('disabled', 'disabled');
  sendEnabled = false;
}

function enableSendButton() {
  sendButton.removeAttr('disabled');
  sendEnabled = true;
}

function setStatus(x) {
  jQuery('#status').text(x);
}

socket.on('updateUserList', function(users) {
  var ol = jQuery('<ol></ol>');

  users.forEach(function(user) {
    ol.append(jQuery('<li></li>').text(user.name));
    console.log(user.name);
  });

  jQuery('#users').html(ol);
});