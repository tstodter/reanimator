const {merge} = require('ramda');

module.exports = (startingNeuron) => merge(
  {
    subs      : [],
    pubs      : [],
    pubs_error: [],
    f         : msg => Promise.resolve(msg)
  },
  startingNeuron
);
