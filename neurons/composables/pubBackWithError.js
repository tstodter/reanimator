const R = require('ramda');
const pubErrorsTo = require('./pubErrorsTo');

// module.exports = pubErrorsTo(msg => {
//   const res = R.pathOr([], ['reply_to', 'errors'])(msg);
//   console.log('in pub errors to', res);
//
//   return R.pathOr([], ['reply_to', 'errors'])(msg);
// });

module.exports = pubErrorsTo(R.pipe(
  R.tryCatch(
    JSON.parse,
    err => console.log('Error determining pub_errors array:', err.message) || {}
  ),
  R.pathOr([], ['reply_to', 'errors'])
));
