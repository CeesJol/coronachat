/**
 * Validate if a string is valid:
 * - it is of type string
 * - it contains at least one character (a letter for instance)
 * @param {*} str the string to be checked
 */
var isRealString = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};

module.exports = {isRealString};