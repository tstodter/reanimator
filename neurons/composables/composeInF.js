const {curry} = require('ramda');
const combineNeurons = require('./combineNeurons');
const makeNeuron = require('./makeNeuron');

module.exports = curry((f, neuron) => combineNeurons(
  neuron,
  makeNeuron({
    f
  })
));
