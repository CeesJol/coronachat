
/**
 * Create an alert
 * @param {*} messageText the text of the message
 */
function createAlert(messageText) {
  var template = jQuery('#alert-template').html();

  var html = Mustache.render(template, {
    text: messageText
  });

  jQuery('#messages').append(html);
}

function createMessage(from, id, messageText) {
  socket.emit('createMessage', {
    from: from,
    fromID: id,
    text: messageText
  }, function() {
    messageTextbox.val('');
    setStatus('Online');
  });
}

/**
 * Scroll to bottom, if user is near bottom
 */
function scrollToBottom() {
  // Selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');

  // Heights
  var clientHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  var scrollHeight = messages.prop('scrollHeight');

  if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
}

function disableSendButton() {
  sendButton.attr('disabled', 'disabled');
  sendEnabled = false;
}

function enableSendButton() {
  sendButton.removeAttr('disabled');
  sendEnabled = true;
}

function setStatus(x) {
  jQuery('#status').text('Dev status: ' + x);
}