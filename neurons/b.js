const R = require('ramda');
const N = require('./composables');

module.exports = R.compose(
  N.composeInJsonF(async (msg) => {
    console.log('in b, received', msg);
    return {
      ...msg,
      data: 'b result'
    };
  }),
  N.subTo('reanimator.a'),
  N.pubTo('reanimator.b'),
  N.pubToLogs,
  N.pubBackWithError,
  N.makeNeuron
)();
