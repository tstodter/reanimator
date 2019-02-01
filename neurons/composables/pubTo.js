const {curry} = require('ramda');
const combineNeurons = require('./combineNeurons');
const makeNeuron = require('./makeNeuron');

const wrapInArray = require('./helpers/wrapInArray');

const applyToOrReturn = require('./helpers/applyToOrReturn');

module.exports = curry((destinationTopics, neuron) => {
  return combineNeurons(
    neuron,
    makeNeuron({
      pubs: msg => wrapInArray(applyToOrReturn(msg)(destinationTopics))
    })
  )
});
