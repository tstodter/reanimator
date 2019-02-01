const {is} = require('ramda');

module.exports = x => is(Array)(x)
  ? x
  : [x];
