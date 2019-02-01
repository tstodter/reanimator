const R = require('ramda');
const N = require('./composables');

module.exports = R.compose(
  N.subTo('reanimator.error'),
  N.pubToLogs,
  N.composeInF(async (msg) => {
    console.log('in error, received', msg);
  }),
  N.makeNeuron
)();
