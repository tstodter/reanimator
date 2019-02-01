const {curry} = require('ramda');

const union = (a, b) => [...new Set([...a, ...b])];

const applyToOrReturn = require('./helpers/applyToOrReturn');
const wrapInArray = require('./helpers/wrapInArray');

const unionPotentialArraysBy = attribute => (n1, n2) => msg => {
  return union(
    wrapInArray(applyToOrReturn(msg)(n1[attribute])),
    wrapInArray(applyToOrReturn(msg)(n2[attribute]))
  );
};

module.exports = curry((n1, n2) => {
  return ({
    subs      : union(n1.subs, n2.subs),
    pubs      : unionPotentialArraysBy('pubs')(n1, n2),
    pubs_error: unionPotentialArraysBy('pubs_error')(n1, n2),
    f         : async (msg) => {
      return n2.f(await n1.f(msg));

      //
      // const [
      //   n1Res, n2Res
      // ] = await Promise.all([n1.f(msg), n2.f(msg)]);
      //
      // return n2Res || n1Res;
    }
  });
});
