const {curry} = require('ramda');

const applyToOrReturn = require('./helpers/applyToOrReturn');

module.exports = curry((n, msg) => {
  return ({
    subs      : n.subs,
    pubs      : applyToOrReturn(msg)(n.pubs),
    pubs_error: applyToOrReturn(msg)(n.pubs_error),
    f         : n.f
  });
});
