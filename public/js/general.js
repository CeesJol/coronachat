
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

/**
 * Create alert, allowing user to refresh the page and find a new chat partner
 */
function createRefreshAlert() {
  var template = jQuery('#alert-refresh-template').html();

  var html = Mustache.render(template, {});

  jQuery('#messages').append(html);
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
 * Set the dev status
 * @param {*} x the status
 */
function setStatus(x) {
  jQuery('#status').text('Dev status: ' + x);
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

const VALID_CHARS = 'A-Za-z-ÁÀȦÂÄǞǍĂĀÃÅǺǼǢĆĊĈČĎḌḐḒÉÈĖÊËĚĔĒẼE̊ẸǴĠĜǦĞG̃ĢĤḤáàȧâäǟǎăāãåǻǽǣćċĉčďḍḑḓéèėêëěĕēẽe̊ẹǵġĝǧğg̃ģĥḥÍÌİÎÏǏĬĪĨỊĴĶǨĹĻĽĿḼM̂M̄ʼNŃN̂ṄN̈ŇN̄ÑŅṊÓÒȮȰÔÖȪǑŎŌÕȬŐỌǾƠíìiîïǐĭīĩịĵķǩĺļľŀḽm̂m̄ŉńn̂ṅn̈ňn̄ñņṋóòôȯȱöȫǒŏōõȭőọǿơP̄ŔŘŖŚŜṠŠȘṢŤȚṬṰÚÙÛÜǓŬŪŨŰŮỤẂẀŴẄÝỲŶŸȲỸŹŻŽẒǮp̄ŕřŗśŝṡšşṣťțṭṱúùûüǔŭūũűůụẃẁŵẅýỳŷÿȳỹźżžẓǯßœŒçÇ0-9 _-';

/**
 * Sanitizes a string, using the whitelist above.
 * All characters not in the whitelist are removed.
 * For example: 
 *    <script>alert('f')
 *  becomes 
 *    _script_alert__f__
 * @param {*} x the string to be sanitized
 */
function sanitize(x) {
  var regex = new RegExp('[^' + VALID_CHARS + ']', 'g');
  return x.replace(regex, '_');
}