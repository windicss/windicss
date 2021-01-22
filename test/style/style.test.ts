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

    it('empty property input', () => {
        const s = new Style('.test');
        expect(s.build()).toBe('.test {}');
        expect(s.build(true)).toBe('.test{}');
    })

    it('add property', () => {
        const s2 = new Style('.test');
        s2.add(p1);
        s2.add(p2);
        expect(s2.build()).toEqual(s.build());
    })

    it('add property list', () => {
        const s2 = new Style('.test');
        s2.add([p1, p2]);
        expect(s2.build()).toEqual(s.build());
    })

    it('add style', () => {
        const s2 = new Style('.test', new Property('background', '#fff'));
        s2.add(s);
        expect(s2.build(true)).toEqual('.test{background:#fff;.test{padding:1rem;color:#1C1C1E}}')
    })

    it('extend style', () => {

    })

    it('add pseudoClass', () => {
        expect(new Style('.test', [p1, p2]).pseudoClass('hover').rule).toBe('.test:hover');
        expect(new Style('.test', [p1, p2]).pseudoClass('hover').pseudoClass('focus').rule).toBe('.test:hover:focus');
    })

    it('add pseudoElement', () => {
        expect(new Style('.test', [p1, p2]).pseudoElement('first-line').rule).toBe('.test::first-line');
        expect(new Style('.test', [p1, p2]).pseudoElement('first-line').pseudoElement('last-line').rule).toBe('.test::first-line::last-line');
        expect(new Style('.test', [p1, p2]).pseudoElement('first-line').pseudoClass('hover').rule).toBe('.test:hover::first-line');
    })

    it('add atrule', () => {
        expect(new Style('.test', [p1, p2]).atRule('@media (min-width: 768px)').build()).toBe('@media (min-width: 768px) {\n  .test {\n    padding: 1rem;\n    color: #1C1C1E;\n  }\n}');
        expect(new Style('.test', [p1, p2]).atRule('@media (min-width: 768px)').build(true)).toBe('@media(min-width:768px){.test{padding:1rem;color:#1C1C1E}}');
        expect(new Style('.test', [p1, p2]).atRule('@media (min-width: 768px)').atRule('@media (prefers-color-scheme: dark)').build()).toBe('@media (prefers-color-scheme: dark) {\n  @media (min-width: 768px) {\n    .test {\n      padding: 1rem;\n      color: #1C1C1E;\n    }\n  }\n}');
        expect(new Style('.test', [p1, p2]).pseudoElement('first-line').pseudoClass('hover').atRule('@media (min-width: 768px)').atRule('@media (prefers-color-scheme: dark)').build()).toBe('@media (prefers-color-scheme: dark) {\n  @media (min-width: 768px) {\n    .test:hover::first-line {\n      padding: 1rem;\n      color: #1C1C1E;\n    }\n  }\n}');
    })

    it('add parent selector', () => {
        expect(new Style('.test').parent('.dark').rule).toBe('.dark .test');
        expect(new Style('.test').parent('.dark').pseudoClass('hover').rule).toBe('.dark .test:hover');
    })

    it('add child selector', () => {
        expect(new Style('.test').child('p').rule).toBe('.test p');
        expect(new Style('.test').child('+ p').rule).toBe('.test + p');
        expect(new Style('.test').child(', p').rule).toBe('.test , p');
        expect(new Style('.test').child('> :not([hidden]) ~ :not([hidden])').rule).toBe('.test > :not([hidden]) ~ :not([hidden])');
        expect(new Style('.test').parent('.dark').pseudoClass('hover').child('> :not([hidden]) ~ :not([hidden])').rule).toBe('.dark .test:hover > :not([hidden]) ~ :not([hidden])');
    })

    it('add brother selector', () => {
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