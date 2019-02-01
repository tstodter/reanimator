const {compose} = require('ramda');

const pubTo = require('./pubTo');
const pubErrorsTo = require('./pubErrorsTo');

module.exports = compose(
  pubTo(['logs']),
  pubErrorsTo(['logs'])
);
