// Generate random id
var randomId = () => {
  // return Date.now() + Math.floor(Math.random() * 1e6);

  var length = 10;
  var result = "";

  var randomChar = () => {
    var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*";
    var val = Math.floor(Math.random() * chars.length);
    return chars.substr(val, 1);
  }

  for (var i = 0; i < length; i++) {
    result += randomChar();
  }

  return result;
}

module.exports = {randomId};