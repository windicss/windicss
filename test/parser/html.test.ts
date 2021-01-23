import { readFileSync } from 'fs';
import { HTMLParser } from '../../src/utils/parser';

const HTML = readFileSync('./test/assets/example.html').toString();

describe('HTMLParser', () => {
    it('parse tags', () => {
        const parser = new HTMLParser();
        expect(parser.parseTags().length).toBe(0);
        parser.html = HTML;
        expect(parser.parseTags()).toEqual([
            'div', 'img',  'p',
            'ul',  'li',   'span',
            'svg', 'path', 'code',
            'a'
        ]);
    })

    it('parse classes', () => {
        const parser = new HTMLParser();
        expect(parser.parseClasses().length).toBe(0);
        parser.html = HTML;
        expect(parser.parseClasses().map(i=>i.result)).toEqual([
            'container min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 md:py-0 lg:py-2 xl:py-4',
            'relative py-3 sm:max-w-xl sm:mx-auto',
            'absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl',
            'relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20',
            'max-w-md mx-auto',
            'h-7 sm:h-8',
            'divide-y divide-gray-200',
            'py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7',
            'list-disc space-y-2',
            'flex items-start',
            'h-6 flex items-center sm:h-7',
            'flex-shrink-0 h-5 w-5 text-cyan-500',
            'ml-2',
            'text-sm font-bold text-gray-900',
            'flex items-start',
            'h-6 flex items-center sm:h-7',
            'flex-shrink-0 h-5 w-5 text-cyan-500',
            'ml-2',
            'text-sm font-bold text-gray-900',
            'flex items-start',
            'h-6 flex items-center sm:h-7',
            'flex-shrink-0 h-5 w-5 text-cyan-500',
            'ml-2',
            'pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7',
            'text-cyan-600 hover:text-cyan-700'
          ]);
    })
})