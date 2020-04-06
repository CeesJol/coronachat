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
 * Create alert, allowing user to refresh the page to reconnect
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
 * Create alert, allowing user to leave the page
 */
function createLeaveAlert(messageText) {
  var template = jQuery('#alert-leave-template').html();
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
    sendingMessage = false;
    updateFooter();
  });  
  drawMessageFromMe(id, from, messageText);
}

function drawMessageFromMe(from, id, text) {
  var formattedTime = moment(moment().valueOf()).format('HH:mm');
  var template = jQuery('#message-template-color').html();
  if (volume) audio.sent.play();
  
  actuallyDrawMessage(from, id, text, formattedTime, template);
}

function drawMessage(from, id, text, createdAt) {
  var formattedTime = moment(createdAt).format('HH:mm');
  var template = jQuery((lastMessageId == id) ? '#message-template' : '#message-template-username').html();
  if (!focused) audio.notification.play();
  else if (volume) audio.message.play();
  
  actuallyDrawMessage(from, id, text, formattedTime, template);
}

function actuallyDrawMessage(from, id, text, formattedTime, template) {
  lastMessageId = id;

  var html = Mustache.render(template, {
    text: text,
    from: from, 
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);

  scrollToBottom();
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
 * Update the send button: enabled/disabled
 */
function updateFooter() {
  if (connected == false) {
    disableSendButton();
    setButton('Offline');
    setStatus('Offline');
    disableInput();
  } else if (sendingMessage) {
    disableSendButton();
    sendStatus(userID, 'Online');
    setButton('Versturen...');
  } else {
    setButton('Verstuur');
    enableInput();
    if (sendEnabled && !isRealString(inputField.val())) {
      disableSendButton();
      sendStatus(userID, 'Online');
    } else if (!sendEnabled && isRealString(inputField.val())) {
      enableSendButton();
      sendStatus(userID, username + ' is aan het typen...');
    }
  }
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

var volume = true;
/**
 * Set volume and the corresponding icon toggle
 */
jQuery('#volume-option-toggle').click(function() {
  jQuery("#volume-option-img").attr("src", "/./img/" + ((volume) ? "volume_mute.png" : "volume.png"));
  volume = !volume;
});

/**
 * Create a list of users in the header
 * @param {*} users the array of users
 */
function createUserList(users) {
  var status = jQuery('#status');

  status.html("");

  users.forEach(function (user) {
    if (user.id != userID) {
      status.append(user.name + ', '); 
    }
  });

  status.append('U');
}