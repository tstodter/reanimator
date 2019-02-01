module.exports = (...args) => (potentialF) => typeof potentialF === 'function'
  ? potentialF(...args)
  : potentialF;
