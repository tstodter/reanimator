const R = require('ramda');
const N = require('./composables');

module.exports = R.compose(
  N.composeInF(async (msg) => {
    console.log('LOG:', msg);
  }),
  N.subTo('logs'),
  N.makeNeuron
)();
