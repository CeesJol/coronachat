var socket = io();

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
  var li = jQuery('<li></li>');
  li.text(`${message.from} ${formattedTime}: ${message.text}`);

  jQuery('#messages').append(li);
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