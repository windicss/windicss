import { ClassParser } from '../../src/utils/parser';

describe('ClassParser', () => {
  it('should remove duplicated classes', () => {
    expect(new ClassParser('font-bold font-bold bg-red-300').parse().length).toEqual(2);
    expect(new ClassParser('font-bold font-bold bg-red-300').parse(false).length).toEqual(3);
  });

  it('parse', () => {
    const classes = 'font-bold text-green-300 dark:font-medium dark:p-4 -sm:border +sm:float-right md: hover:  (bg-black-300 text-gray-200   text-lg dark:(bg-black-300 text-gray-200)) md:text-red-500 hover:  text-red-300 text-green-300 sm:hover:bg-red-500 dark:hover:bg-black-300 sm:dark:hover:bg-gray-300 abc bg-cool-gray-300 bg-hex-fff bg-rgb(32,31,22) bg-raw(#fff) bg-rgba(255, 0, 0, 0.3) bg-hsl(0, 100%, 25%) bg-hsla(0, 100%, 50%, 0.5)';
    const parser = new ClassParser();
    expect(parser.parse().length).toBe(0);
    parser.classNames = classes;
    expect(parser.parse()).toMatchSnapshot('class parser');
  });

  it('parse important', () => {
    const classes = '!text-green-300 font-bold !hover:(p-4 bg-red-500) focus:(!border float-right)';
    const parser = new ClassParser(classes);
    expect(parser.parse()).toMatchSnapshot('parse important');
  });
});
