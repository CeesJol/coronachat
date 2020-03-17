var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Jen';
    var id = '123';
    var text = 'Some message';
    var message = generateMessage(from, id, text);

    expect(message.createdAt).toBeA('number');
    expect(message).toInclude({from, id, text});
  });
});
