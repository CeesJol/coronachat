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