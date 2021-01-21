import { Property, Style } from '../../src/utils/style';

describe('Style', () => {
    const p1 = new Property('padding', '1rem');
    const p2 = new Property('color', '#1C1C1E');
    const s = new Style('.test', [p1, p2]);

    it('normal build', () => {
        expect(s.build()).toBe('.test {\n  padding: 1rem;\n  color: #1C1C1E;\n}');
    })

    it('minimized build', () => {
        expect(s.build(true)).toBe('.test{padding:1rem;color:#1C1C1E}');
    })

    it('add property', () => {

    })

    it('pseudoClass test', () => {
        expect(new Style('.test', [p1, p2]).pseudoClass('hover').rule).toBe('.test:hover');
        expect(new Style('.test', [p1, p2]).pseudoClass('hover').pseudoClass('focus').rule).toBe('.test:hover:focus');
    })

    it('pseudoElement test', () => {
        expect(new Style('.test', [p1, p2]).pseudoElement('first-line').rule).toBe('.test::first-line');
        expect(new Style('.test', [p1, p2]).pseudoElement('first-line').pseudoElement('last-line').rule).toBe('.test::first-line::last-line');
        expect(new Style('.test', [p1, p2]).pseudoElement('first-line').pseudoClass('hover').rule).toBe('.test:hover::first-line');
    })

    it('atrule test', () => {
        expect(new Style('.test', [p1, p2]).atRule('@media (min-width: 768px)').build()).toBe('@media (min-width: 768px) {\n  .test {\n    padding: 1rem;\n    color: #1C1C1E;\n  }\n}');
        expect(new Style('.test', [p1, p2]).atRule('@media (min-width: 768px)').build(true)).toBe('@media(min-width:768px){.test{padding:1rem;color:#1C1C1E}}');
        expect(new Style('.test', [p1, p2]).atRule('@media (min-width: 768px)').atRule('@media (prefers-color-scheme: dark)').build()).toBe('@media (prefers-color-scheme: dark) {\n  @media (min-width: 768px) {\n    .test {\n      padding: 1rem;\n      color: #1C1C1E;\n    }\n  }\n}');
        expect(new Style('.test', [p1, p2]).pseudoElement('first-line').pseudoClass('hover').atRule('@media (min-width: 768px)').atRule('@media (prefers-color-scheme: dark)').build()).toBe('@media (prefers-color-scheme: dark) {\n  @media (min-width: 768px) {\n    .test:hover::first-line {\n      padding: 1rem;\n      color: #1C1C1E;\n    }\n  }\n}');
    })

    it('parent selector test', () => {
        expect(new Style('.test').parent('.dark').rule).toBe('.dark .test');
        expect(new Style('.test').parent('.dark').pseudoClass('hover').rule).toBe('.dark .test:hover');
    })

    it('child selector test', () => {
        expect(new Style('.test').child('p').rule).toBe('.test p');
        expect(new Style('.test').child('+ p').rule).toBe('.test + p');
        expect(new Style('.test').child(', p').rule).toBe('.test , p');
        expect(new Style('.test').child('> :not([hidden]) ~ :not([hidden])').rule).toBe('.test > :not([hidden]) ~ :not([hidden])');
        expect(new Style('.test').parent('.dark').pseudoClass('hover').child('> :not([hidden]) ~ :not([hidden])').rule).toBe('.dark .test:hover > :not([hidden]) ~ :not([hidden])');
    })

    it('brother selector test', () => {
        expect(new Style('.test').brother('hello').rule).toBe('.test.hello');
        expect(new Style('.test').brother('hello').brother('world').rule).toBe('.test.hello.world');
    })

    it('wrap selector', () => {
        expect(new Style('.test').wrapSelector((selector)=>`:global(${selector})`).rule).toBe(':global(.test)')
        expect(new Style('.test').wrapSelector((selector)=>`:global(${selector})`).wrapSelector((selector)=>`:global2(${selector})`).rule).toBe(':global2(:global(.test))')
        expect(new Style('.test').pseudoClass('hover').wrapSelector((selector)=>`:global(${selector})`).rule).toBe(':global(.test):hover')
        expect(new Style('.test').pseudoClass('hover').wrapSelector((selector)=>`:global(${selector})`).wrapSelector((selector)=>`:global2(${selector})`).rule).toBe(':global2(:global(.test)):hover')
    })

    it('wrap rule', () => {
        expect(new Style('.test').pseudoClass('hover').wrapRule((rule)=>`:global(${rule})`).rule).toBe(':global(.test:hover)')
        expect(new Style('.test').wrapRule((rule)=>`:global(${rule})`).wrapRule((rule)=>`:global2(${rule})`).rule).toBe(':global2(:global(.test))')
    })
})