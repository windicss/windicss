import { Style } from '../../src/utils/style';
import { sortSelector } from '../../src/utils/algorithm';

describe("sort selector", () => {
  it ("should sort correctly", () => {
    const styles = [
      new Style(':root'),
      new Style('::moz-focus-inner'),
      new Style('::-webkit-inner-spin-button'),
      new Style('*'),
      new Style('.test'),
      new Style('a'),
      new Style('#id'),
      new Style('body'),
      new Style('.bg-red-500'),
      new Style('.p-4'),
      new Style('.pt-4'),
      new Style('.p-2'),
    ];
    expect(styles.sort(sortSelector).map(i => i.selector)).toEqual(['*', ':root', '::moz-focus-inner', '::-webkit-inner-spin-button', 'a', 'body', '.bg-red-500', '.p-4', '.p-2', '.pt-4', '.test', '#id']);
  });
})
