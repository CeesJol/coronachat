const expect = require('expect');

var {randomId} = require('./general');

describe('randomId', () => {
  it('should generate a random id', () => {
    var length = 10;
    var res = randomId();

    expect(res.length).toBe(length);
  });
  it('should generate unique ids', () => {
    // Flaky but highly unprobable to fail
    var res1 = randomId();
    var res2 = randomId();

    expect(res1 == res2).toBe(false);
  });
});
