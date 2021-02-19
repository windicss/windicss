import {
  combineObject,
  deepList,
  handleNest,
} from '../../src/utils/algorithm/compileStyleSheet';

import { Property, Style } from '../../src/utils/style';

describe('compileStyleSheet', () => {
  it('combineObject', () => {
    expect(combineObject({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
    expect(combineObject({ a: { b: 1 } }, { a: { c: 2 } })).toEqual({
      a: { b: 1, c: 2 },
    });
    expect(combineObject({ a: { b: 1 } }, { a: { b: 2 } })).toEqual({
      a: { b: [1, 2] },
    });
  });

  it('deepList', () => {
    expect(deepList(['a'])).toEqual({ a: {} });
    expect(deepList(['a', 'b'])).toEqual({ a: { b: {} } });
    expect(deepList(['a', 'b', 'c'], 1)).toEqual({
      a: { b: { c: 1 } },
    });
  });

  it('handleNest', () => {
    expect(handleNest([])).toEqual([]);
    expect(handleNest([new Style('.test', new Property('font-size', '1em'))])).toEqual(['.test {\n  font-size: 1em;\n}']);
  });
});

snapshotContext(__filename);
