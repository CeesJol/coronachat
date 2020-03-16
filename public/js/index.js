var socket = io();

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

socket.on('connect', function() {
  console.log('Connected to server');

  setStatus('Online');
});

socket.on('disconnect', function() {
  console.log('Disconnected to server');

  setStatus('Offline');
});

socket.on('newMessage', function (message) {
  var formattedTime = moment(message.createdAt).format('HH:mm');
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from, 
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.emit('createMessage', {
  from: 'Frank',
  text: 'hi'
}, function(data) {
  console.log('Got it', data)
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
    from: 'User',
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