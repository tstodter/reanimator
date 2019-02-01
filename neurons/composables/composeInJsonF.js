const R = require('ramda');
const composeInF = require('./composeInF');

module.exports = R.curry((f, neuron) => composeInF(async (msg) => {
  const parsed = JSON.parse(msg);
  const result = await f(parsed);
  return JSON.stringify(result)
}, neuron));
