var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'Cees';
    var text = 'hey';
    var message = generateMessage(from, text);

    expect(message.from).toEqual('Cees');
    expect(message.text).toEqual('hey');
    expect(message).toInclude({from, text});
    expect(message.createdAt).toBeA('number');
  });
});