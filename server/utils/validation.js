/**
 * Validate if a string is valid:
 * - it is of type string
 * - it contains at least one character (a letter for instance)
 * @param {*} str the string to be checked
 */
var isRealString = (str) => {
  return typeof str === 'string' && str.trim().length > 0;
};

const VALID_CHARS = 'A-Za-z-ÁÀȦÂÄǞǍĂĀÃÅǺǼǢĆĊĈČĎḌḐḒÉÈĖÊËĚĔĒẼE̊ẸǴĠĜǦĞG̃ĢĤḤáàȧâäǟǎăāãåǻǽǣćċĉčďḍḑḓéèėêëěĕēẽe̊ẹǵġĝǧğg̃ģĥḥÍÌİÎÏǏĬĪĨỊĴĶǨĹĻĽĿḼM̂M̄ʼNŃN̂ṄN̈ŇN̄ÑŅṊÓÒȮȰÔÖȪǑŎŌÕȬŐỌǾƠíìiîïǐĭīĩịĵķǩĺļľŀḽm̂m̄ŉńn̂ṅn̈ňn̄ñņṋóòôȯȱöȫǒŏōõȭőọǿơP̄ŔŘŖŚŜṠŠȘṢŤȚṬṰÚÙÛÜǓŬŪŨŰŮỤẂẀŴẄÝỲŶŸȲỸŹŻŽẒǮp̄ŕřŗśŝṡšşṣťțṭṱúùûüǔŭūũűůụẃẁŵẅýỳŷÿȳỹźżžẓǯßœŒçÇ0-9 .,:;!?@#$%^&*_-';

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

module.exports = {isRealString, sanitize};