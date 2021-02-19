import { Property, InlineAtRule } from '../../src/utils/style';

describe('Property', () => {
  it('normal build', () => {
    const p1 = new Property('padding', '1rem');
    const p2 = new Property(['padding-left', 'padding-right'], '1rem');
    const p3 = new Property('padding', '1rem', undefined, true);
    const p4 = new Property(['padding-left', 'padding-right'], '1rem', undefined, true);

    expect(p1.build()).toBe('padding: 1rem;');
    expect(p2.build()).toBe('padding-left: 1rem;\npadding-right: 1rem;');
    expect(p3.build()).toBe('padding: 1rem !important;');
    expect(p3.build(true)).toBe('padding:1rem!important;');
    expect(p4.build()).toBe('padding-left: 1rem !important;\npadding-right: 1rem !important;');
  });
  it('minimized build', () => {
    const p1 = new Property('padding', '1rem');
    const p2 = new Property(['padding-left', 'padding-right'], '1rem');

    expect(p1.build(true)).toBe('padding:1rem;');
    expect(p2.build(true)).toBe('padding-left:1rem;padding-right:1rem;');
  });

  it('undefined value input', () => {
    const p = new Property('padding');

    expect(p.build()).toBe('');
  });

  it('initial with comment', () => {
    const p1 = new Property('padding', '1rem', 'p-4');
    const p2 = new Property(['padding-left', 'padding-right'], '1rem', 'px-4');

    expect(p1.build()).toBe('padding: 1rem; /* p-4 */');
    expect(p2.build()).toBe(
      'padding-left: 1rem; /* px-4 */\npadding-right: 1rem; /* px-4 */'
    );

    expect(p1.build(true)).toBe('padding:1rem;');
    expect(p2.build(true)).toBe('padding-left:1rem;padding-right:1rem;');
  });

  it('parse', () => {
    const p1 = Property.parse('padding-left:1rem');
    const p2 = Property.parse('   padding-right : 1rem ;  ');
    const p3 = Property.parse('padding-left:1rem;padding-right:2rem;');
    const p4 = Property.parse('padding-left:1rem;  padding-right:2rem');
    const p5 = Property.parse('padding;');
    const p6 = Property.parse('@apply font-bold text-lg ;');
    const p7 = Property.parse('padding:1rem;@apply font-bold;');

    expect(!(p1 instanceof Property) || [p1.name, p1.value]).toEqual([
      'padding-left',
      '1rem',
    ]);

    expect(!(p2 instanceof Property) || [p2.name, p2.value]).toEqual([
      'padding-right',
      '1rem',
    ]);

    expect(!Array.isArray(p3) || p3.map((i) => [i.name, i.value])).toEqual([
      ['padding-left', '1rem'],
      ['padding-right', '2rem'],
    ]);

    expect(!Array.isArray(p4) || p4.map((i) => [i.name, i.value])).toEqual([
      ['padding-left', '1rem'],
      ['padding-right', '2rem'],
    ]);

    expect(p5).toBeUndefined();

    expect(!(p6 instanceof InlineAtRule) || [p6.name, p6.value]).toEqual([
      'apply',
      'font-bold text-lg',
    ]);

    expect(
      !(
        Array.isArray(p7) &&
        p7[0] instanceof Property &&
        p7[1] instanceof InlineAtRule
      ) || p7.map((i) => [i.name, i.value])
    ).toEqual([
      ['padding', '1rem'],
      ['apply', 'font-bold'],
    ]);
  });

  it('toStyle', () => {
    const p = new Property('padding', '1rem');

    expect(p.toStyle().build()).toEqual('padding: 1rem;');
    expect(p.toStyle('.p-4').build()).toEqual('.p-4 {\n  padding: 1rem;\n}');
    expect(p.toStyle('.sm:p-4').build()).toEqual(
      '.sm:p-4 {\n  padding: 1rem;\n}'
    );
  });
});

snapshotContext(__filename);
