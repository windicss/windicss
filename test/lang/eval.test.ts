import { parse, eval } from '../../src/lang';

describe('Windi Lang', () => {
  it('simple parse', () => {
    const ast = parse('$a + $b / $c');
    expect(ast).toMatchSnapshot('ast');
  });
  it('simple eval', () => {
    const ast = parse('$a + $b / $c');
    const value = eval(ast, {
      $a: 2,
      $b: 3,
      $c: 4,
    });
    expect(value).toEqual(2.75);
  });
  it('boolean', () => {
    const ast = parse('!$a');
    const value = eval(ast, {
      $a: false,
    });
    expect(value).toEqual(true);
  });
});
