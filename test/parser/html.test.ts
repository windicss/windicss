import { readFileSync } from 'fs';
import { HTMLParser } from '../../src/utils/parser';

const EXAMPLE_1 = readFileSync('./test/assets/example.html').toString();
const EXAMPLE_2 = readFileSync('./test/assets/example2.html').toString();

describe('HTMLParser', () => {
  it('parse tags', () => {
    const parser = new HTMLParser();
    expect(parser.parseTags().length).toBe(0);
    parser.html = EXAMPLE_1;
    expect(parser.parseTags()).toMatchSnapshot('tag');
  });

  it('parse classes', () => {
    const parser = new HTMLParser();
    expect(parser.parseClasses().length).toBe(0);
    parser.html = EXAMPLE_1;
    expect(parser.parseClasses()).toMatchSnapshot('class');
  });

  it('parse attributes', () => {
    const parser = new HTMLParser(EXAMPLE_2);
    expect(parser.parseAttrs()).toMatchSnapshot('attr');
  });

  it('parse jsx syntax', () => {
    const parser = new HTMLParser('class={`z-20 bg-green-600 ${variable}`}');
    expect(parser.parseClasses()).toMatchSnapshot('class');
    parser.html = '<div className={css`height:calc(100% - 56px)`}><div className="float-left w-250px h-full bg-hex-f7f7fa overflow-y-auto"></div></div>';
    expect(parser.parseClasses()).toMatchSnapshot('className');
  });
});
