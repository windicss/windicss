import { Property, Style, StyleSheet } from '../../src/utils/style';

describe('StyleSheet', () => {
  const s1 = new Style('.bg-white', new Property('--bg-opacity', '1'));
  const s2 = new Style('.bg-white', new Property('background-color', 'rgba(255, 255, 255, var(--tw-bg-opacity))'));
  const s3 = new Style('.py-10', new Property(['padding-top', 'padding-bottom'], '2.5rem'));

  s1.updateMeta({ type: 'base', corePlugin: false, group: 'plugin', order: 0 });
  s2.updateMeta({ type: 'components', corePlugin: false, group: 'plugin', order: 1 });
  s3.updateMeta({ type: 'utilities', corePlugin: false, group: 'plugin', order: 2 });

  it('initial', () => {
    const ss = new StyleSheet([s1, s2, s3]);
    expect(ss.children.length).toBe(3);
    expect(ss.build(true)).toBe(
      '.bg-white{--bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.py-10{padding-top:2.5rem;padding-bottom:2.5rem}'
    );
  });

  it('add style', () => {
    // expect
    const ss = new StyleSheet();
    ss.add(s1);
    ss.add([s2, s3]);
    ss.add();
    expect(ss.children.length).toBe(3);
  });

  it('extend styleSheet', () => {
    expect(new StyleSheet([s1, s2]).extend(new StyleSheet([s2, s3])).children).toEqual([s1, s2, s2, s3]);
    const ss = new StyleSheet();
    expect(ss.extend(undefined)).toBe(ss);
  });

  it('extend same style', () => {
    const s1 = new Style('.a', new Property('color', 'red'));
    const s2 = new Style('.b', new Property('color', 'blue'));
    const ss1 = new StyleSheet([ s1, s2 ]);
    const ss2 = new StyleSheet([ s1, s2 ]);
    expect(ss1.extend(ss2, undefined, true).children.length).toEqual(2);
  });

  it('prepend styleSheet', () => {
    expect(
      new StyleSheet([s1, s2]).extend(new StyleSheet([s2, s3]), false).children
    ).toEqual([s2, s3, s1, s2]);
  });

  it('combine same style selectors', () => {
    const ss = new StyleSheet([s1, s2, s3]).combine();
    expect(ss.children.length).toBe(2);
  });

  it('sort styles', () => {
    const ss = new StyleSheet(
      [
        '.test',
        '.abc',
        'html',
        '*',
        ':root',
        '::moz-focus-inner',
        undefined,
      ].map((i) => new Style(i))
    );
    expect(ss.sort().children.map((i) => i.selector)).toEqual([
      '*',
      ':root',
      '::moz-focus-inner',
      'html',
      '.test',
      '.abc',
      undefined,
    ]);
  });

  it('build', () => {
    const ss = new StyleSheet([s1, s2, s3]);
    expect(ss.build()).toBe(
      '.bg-white {\n  --bg-opacity: 1;\n  background-color: rgba(255, 255, 255, var(--tw-bg-opacity));\n}\n.py-10 {\n  padding-top: 2.5rem;\n  padding-bottom: 2.5rem;\n}'
    );
  });

  it('minimize build', () => {
    const ss = new StyleSheet([s1, s2, s3]);
    expect(ss.build(true)).toBe(
      '.bg-white{--bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.py-10{padding-top:2.5rem;padding-bottom:2.5rem}'
    );
  });
});

describe('meta', () => {
  const s1 = new Style('.bg-white', new Property('--bg-opacity', '1'));
  const s2 = new Style('.bg-white', new Property('background-color', 'rgba(255, 255, 255, var(--tw-bg-opacity))'));
  const s3 = new Style('.py-10', new Property(['padding-top', 'padding-bottom'], '2.5rem'));

  s1.updateMeta({ type: 'base', corePlugin: false, group: 'plugin', order: 0 });
  s2.updateMeta({ type: 'components', corePlugin: false, group: 'plugin', order: 1 });
  s3.updateMeta({ type: 'utilities', corePlugin: false, group: 'plugin', order: 2 });

  it('layer function', () => {
    const ss = new StyleSheet([s1, s2, s3]);
    expect(ss.layer('base').build(true)).toEqual('.bg-white{--bg-opacity:1}');
    expect(ss.layer('components').build(true)).toEqual('.bg-white{background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}');
    expect(ss.layer('utilities').build(true)).toEqual('.py-10{padding-top:2.5rem;padding-bottom:2.5rem}');

  });

  it('split function', () => {
    const sss = new StyleSheet([s1, s2, s3]).split();
    expect(sss.base.build(true)).toEqual('.bg-white{--bg-opacity:1}');
    expect(sss.components.build(true)).toEqual('.bg-white{background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}');
    expect(sss.utilities.build(true)).toEqual('.py-10{padding-top:2.5rem;padding-bottom:2.5rem}');
  });

  it('clone', () => {
    const s1 = new Style('.bg-white', new Property('--bg-opacity', '1'));
    const s2 = new Style('.bg-white', new Property('background-color', 'rgba(255, 255, 255, var(--tw-bg-opacity))'));
    const s3 = new Style('.py-10', new Property(['padding-top', 'padding-bottom'], '2.5rem'));
    const sss = new StyleSheet([s1, s2, s3]);
    expect(sss.clone().build()).toEqual(sss.build());
  });
});
