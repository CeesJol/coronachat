var moment = require('moment');

var generateMessage = (from, id, text) => {
  return {
    from,
    id,
    text,
    createdAt: moment().valueOf()
  };
};

module.exports = {generateMessage};
