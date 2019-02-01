const R = require('ramda');
const N = require('./composables');

module.exports = R.compose(
  N.composeInJsonF(async (msg) => {
    console.log('in a, received', msg);

    return {
      ...msg,
      data: 'a result'
    };
  }),
  N.subTo('reanimator.start'),
  N.pubTo('reanimator.a'),
  N.pubToLogs,
  N.pubBackWithError,
  N.makeNeuron
)();
