// import { parse, eval } from '../../src/lang';

// describe('Windi Lang', () => {
//   it('simple parse', () => {
//     const ast = parse('$a + $b / $c');
//     expect(ast).toMatchSnapshot('ast');
//   });
//   it('simple eval', () => {
//     const ast = parse('$a + $b / $c');
//     const value = eval(ast, {
//       $a: 2,
//       $b: 3,
//       $c: 4,
//     });
//     expect(value).toEqual(2.75);
//   });
//   it('boolean', () => {
//     const ast = parse('!$a');
//     const value = eval(ast, {
//       $a: false,
//     });
//     expect(value).toEqual(true);
//   });
//   it('function', () => {
//     const add = (a:number, b:number) => a + b;
//     const ast = parse('3 + add($a, 2)');
//     const value = eval(ast, {
//       $a: 2,
//       add,
//     });
//     expect(value).toEqual(7);
//   });
//   it('string', () => {
//     const ast = parse('100% $font-stack');
//     // console.log(ast);
//     const value = eval(ast, {
//       '$font-stack': 'Helvetica, sans-serif',
//     });
//     expect(value).toEqual('100% Helvetica, sans-serif');
//   });
// });
