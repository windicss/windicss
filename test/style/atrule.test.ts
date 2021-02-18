import { InlineAtRule } from '../../src/utils/style';

describe('AtRule', () => {
  it('build', () => {
    const v1 = new InlineAtRule('apply', 'font-bold text-md');
    const v2 = new InlineAtRule('apply');

    expect(v1.build()).toBe('@apply font-bold text-md;');
    expect(v2.build()).toBe('@apply;');
  });

  it('parse', () => {
    const v1 = InlineAtRule.parse('@apply  ');
    const v2 = InlineAtRule.parse('@apply font-bold text-md;');
    const v3 = InlineAtRule.parse('  @apply  font-bold text-md ');
    const v4 = InlineAtRule.parse('@apply;');
    const v5 = InlineAtRule.parse('@apply font-bold text-md!important;');

    expect(!v1 || v1.name).toBe('apply');
    expect(!v1 || v1.value).toBeUndefined();

    expect(!v2 || v2.name).toBe('apply');
    expect(!v2 || v2.value).toBe('font-bold text-md');

    expect(!v3 || v3.name).toBe('apply');
    expect(!v3 || v3.value).toBe('font-bold text-md');

    expect(!v4 || v4.name).toBe('apply');
    expect(!v4 || v4.value).toBeUndefined();

    expect(!v5 || v5.value).toBe('font-bold text-md');
    expect(!v5 || v5.important).toBeTrue();
  });
});
