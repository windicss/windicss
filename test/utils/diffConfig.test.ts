import diffConfig from '../../src/utils/algorithm/diffConfig';

describe('diff config', () => {
  it('different', () => {
    expect(diffConfig({}, '3')).toEqual('3');
  });

  it('add', () => {
    expect(diffConfig({ a: 3, b: 4 }, { a: 3, b: 4, c: 5 })).toEqual({ c: 5 });
  });

  it('array', () => {
    expect(diffConfig({ a: [3, 4] }, { a: [3, 4] })).toBeUndefined();
  });
});
