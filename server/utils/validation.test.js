const expect = require('expect');

var {isRealString} = require('./validation');

describe('isRealString', () => {
  it('should reject non-string values', () => {
    var string = 5.5;
    var res = isRealString(string);

    expect(res).toBe(false);
  });
  it('should reject string with only spaces', () => {
    var string = "    ";
    var res = isRealString(string);

    expect(res).toBe(false);
  });
  it('should allow strings with non-space characters', () => {
    var string = "this is a string";
    var res = isRealString(string);

    expect(res).toBe(true);
  });
});
