const currencies = require('./currencies.json');

const isKnownCurrencyCode = (name) =>
  Object.keys(currencies).includes(name.toUpperCase());

const round = (v) => +parseFloat(v).toFixed(2);

const isNumber = (v) => {
  if (typeof v !== 'number')
    throw new Error('Value argument must be a number');
};

module.exports = class CurrencyTable {
  constructor(name) {
    if (!isKnownCurrencyCode(name))
      throw new Error('Unrecognized currency');

    this.base = name;
    return this;
  }

  async seed(loader) {
    const results = await loader(this.base, new Date());
    if (!results) throw new Error('Loader resolved without an results');

    if (typeof results !== 'object')
      throw new Error(
        'Loader must return an object with keys for codes',
      );

    this.$data = Object.entries(results).reduce(
      (prev, [key, value]) =>
        isKnownCurrencyCode(key)
          ? Object.assign(prev, {
              [key]: value,
            })
          : prev,
      {},
    );
  }

  getRate(key) {
    return this.$data[key] || 1;
  }

  to(v, target) {
    isNumber(v);
    return round(v * this.getRate(target));
  }

  from(v, target) {
    isNumber(v);
    return round(v / this.getRate(target));
  }
};
