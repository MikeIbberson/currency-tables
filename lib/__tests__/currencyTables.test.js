const CurrencyTable = require('..');

describe('CurrencyTable', () => {
  describe('instantiation', () => {
    it('should throw an error on unknown currency code', () =>
      expect(() => new CurrencyTable('ZZZ')).toThrowError());

    it('should validate base currency', () =>
      expect(new CurrencyTable('CAD')).toHaveProperty('base', 'CAD'));
  });

  describe('seed', () => {
    it('should call the datasource', async () => {
      const table = new CurrencyTable('CAD');
      const loader = jest.fn(() =>
        Promise.resolve({
          'USD': 1.41,
        }),
      );

      await table.seed(loader);
      expect(loader).toHaveBeenCalledWith('CAD', expect.any(Date));
      expect(table.$data).toHaveProperty('USD', 1.41);
    });
  });

  describe('to', () => {
    it('should convert to the value to base', async () => {
      const table = new CurrencyTable('CAD');
      await table.seed(() =>
        Promise.resolve({
          'GBP': 2.11,
        }),
      );

      return expect(table.to(12.99, 'GBP')).toBe(27.41);
    });

    it('should return unmodified if target equals base', async () => {
      const table = new CurrencyTable('CAD');
      await table.seed(() =>
        Promise.resolve({
          'GBP': 2.11,
        }),
      );

      return expect(table.to(4.49, 'XYFD')).toBe(4.49);
    });
  });

  describe('from', () => {
    it('should convert from the value to base', async () => {
      const table = new CurrencyTable('USD');
      await table.seed(() =>
        Promise.resolve({
          'CAD': 1.41,
        }),
      );

      return expect(table.from(22.11, 'CAD')).toBe(15.68);
    });
  });
});
