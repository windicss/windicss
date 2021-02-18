import { Style } from '../../src/utils/style';
import { sortSelector } from '../../src/utils/algorithm';

describe('sort selector', () => {
  it('should sort correctly', () => {
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
    const selectors = styles.sort(sortSelector).map((i) => i.selector);
    expect(selectors).toMatchSnapshot('selector', __filename);
  });

  it('should sort transform correctly', () => {
    const styles = [
      new Style('.-translate-x-1/2'),
      new Style('.-translate-y-1/2'),
      new Style('.origin-top'),
      new Style('.transform'),
      new Style('.scale-50'),
      new Style('.rotate-5'),
      new Style('.-skew-x-4'),
    ];
    const selectors = styles.sort(sortSelector).map((i) => i.selector);
    expect(selectors).toMatchSnapshot('selector', __filename);
  });
});
