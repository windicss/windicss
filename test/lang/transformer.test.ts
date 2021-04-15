import { Lexer, Parser, Transformer } from '../../src/lang';

describe('Parser', () => {
  it('simple syntax', () => {
    const code = `
    {
      @var number = 2;
      @var a = number;
      @var b = 10 * a + 10 * number / 4;
      @var c = a - - b;
      @var testVariable = 'this is a string';
      @var template = \`test hello \${a + b} \${c}\`;
    }
    `;
    const lexer = new Lexer(code);
    const parser = new Parser(lexer);
    const transformer = new Transformer(parser);
    expect(transformer.transform()).toMatchSnapshot('js');
  });
});
