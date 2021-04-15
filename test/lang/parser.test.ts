// import { Lexer, Parser } from '../../src/lang';

// describe('Parser', () => {
//   it('simple syntax', () => {
//     const code = `
//     {
//       @var number = 2;
//       @var a = number;
//       @var b = 10 * a + 10 * number / 4;
//       @var c = a - - b;
//     }
//     `;
//     const lexer = new Lexer(code);
//     const parser = new Parser(lexer);
//     expect(parser.parse()).toMatchSnapshot('ast');
//   });
// });
