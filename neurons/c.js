const R = require('ramda');
const N = require('./composables');

module.exports = R.compose(
  N.composeInJsonF(async (msg) => {
    console.log('in c, received', msg);

    // throw new Error('big oops');

    return {
      ...msg,
      data: 'c result'
    };
  }),
  N.subTo('reanimator.b'),
  N.pubTo('reanimator.c'),
  N.pubToLogs,
  N.pubBackWithError,
  N.makeNeuron
)();
