import { combineConfig } from '../../src/utils/algorithm';

describe('combineConfig', () => {
  it('should combine different keys', () => {
    expect(combineConfig({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('should extend default', () => {
    expect(combineConfig({ a: 1 }, { a: { b: 2 } })).toEqual({ a: { DEFAULT: 1, b: 2 } });
  });

  it('should combine different nested keys', () => {
    expect(
      combineConfig({ a: { b: 1, d: { e: 1 } } }, { a: { c: 2, d: { f: 2 } } })
    ).toEqual({
      a: { b: 1, c: 2, d: { e: 1, f: 2 } },
    });
  });

  it('b should overwrite a when a and b has same key', () => {
    expect(
      combineConfig(
        { a: { b: 1, c: { d: 3 } }, e: 2 },
        { a: { b: 2, c: { d: 4 } }, e: 3 }
      )
    ).toEqual({
      a: { b: 2, c: { d: 4 } }, e: 3,
    });
  });

  it('should combine two arrays', () => {
    expect(combineConfig({ a: [1, 2] }, { a: [3, 4] })).toEqual({
      a: [1, 2, 3, 4],
    });
  });

  it('should combine deep nested two arrays', () => {
    expect(
      combineConfig({ a: { b: { c: [1, 2] } } }, { a: { b: { c: [3, 4] } } })
    ).toEqual({ a: { b: { c: [1, 2, 3, 4] } } });
  });
});
