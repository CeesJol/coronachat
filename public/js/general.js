
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

  scrollToBottom();
}

/**
 * Create alert, allowing user to refresh the page and find a new chat partner
 */
function createRefreshAlert(messageText) {
  var template = jQuery('#alert-refresh-template').html();
  var html = Mustache.render(template, {
    text: messageText
  });
  jQuery('#messages').append(html);

  scrollToBottom();
}

/**
 * Create a message
 * @param {*} from from
 * @param {*} id id
 * @param {*} messageText text of message
 */
function createMessage(from, id, messageText) {
  socket.emit('createMessage', {
    from: from, 
    fromID: id,
    text: messageText
  }, function() {
    setButton('Send');
  });  
}

/**
 * Scroll to bottom, always
 */
function scrollToBottom() {
  // Selectors
  var messages = jQuery('#messages');
  // var newMessage = messages.children('li:last-child');

  // Heights
  // var clientHeight = messages.prop('clientHeight');
  // var scrollTop = messages.prop('scrollTop');
  // var newMessageHeight = newMessage.innerHeight();
  // var lastMessageHeight = newMessage.prev().innerHeight();

  var scrollHeight = messages.prop('scrollHeight');

  // if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  // }
}

/**
 * Disable the send button
 */
function disableSendButton() {
  sendButton.attr('disabled', 'disabled');
  sendEnabled = false;
}

/**
 * Enable the send button
 */
function enableSendButton() {
  sendButton.removeAttr('disabled');
  sendEnabled = true;
}

/**
 * Disable the input field
 */
function disableInput() {
  inputField.attr('disabled', 'disabled');
}

/**
 * Enable the input field
 */
function enableInput() {
  inputField.removeAttr('disabled');
}

/**
 * Send a new chat status
 * @param {*} x the status
 */
function sendStatus(id, x) {
  socket.emit('sendStatus', {
    fromID: id,
    text: x
  }); 
}

/**
 * Set the chat status
 * @param {*} x the status
 */
function setStatus(x) {
  jQuery('#status').text(x);
}

/**
 * Set the text of the send button
 * @param {*} x the text
 */
function setButton(x) {
  jQuery('#send-button').text(x);
}

/**
 * Validate if a string is valid:
 * - it is of type string
 * - it contains at least one character (a letter for instance)
 * @param {*} str the string to be checked
 */
function isRealString(str) {
  return typeof str === 'string' && str.trim().length > 0;
}

/**
 * Set vh
 */
function myFunction() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
} myFunction();

window.addEventListener('resize', function() {
  myFunction();
});