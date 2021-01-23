import { Property, Style, StyleSheet } from '../../src/utils/style';

describe('StyleSheet', () => {
    const s1 = new Style('.bg-white', new Property('--bg-opacity', '1'));
    const s2 = new Style('.bg-white', new Property('background-color', 'rgba(255, 255, 255, var(--tw-bg-opacity))'));
    const s3 = new Style('.py-10', new Property(['padding-top', 'padding-bottom'], '2.5rem'));

    it('initial', () => {
        const ss = new StyleSheet([s1, s2, s3]);
        expect(ss.children.length).toBe(3);
        expect(ss.build(true)).toBe('.bg-white{--bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.py-10{padding-top:2.5rem;padding-bottom:2.5rem}')
    })

    it('add style', () => {
        // expect
        const ss = new StyleSheet();
        ss.add(s1);
        ss.add([s2, s3]);
        ss.add();
        expect(ss.children.length).toBe(3);
    })

    it('extend styleSheet', () => {
        expect(new StyleSheet([s1, s2]).extend(new StyleSheet([s2, s3])).children).toEqual([s1, s2, s2, s3]);
        const ss = new StyleSheet();
        expect(ss.extend(undefined)).toBe(ss);
    })

    it('prepend styleSheet', () => {
        expect(new StyleSheet([s1, s2]).extend(new StyleSheet([s2, s3]), false).children).toEqual([s2, s3, s1, s2]);
    })

    it('combine same style selectors', () => {
        const ss = new StyleSheet([s1, s2, s3]).combine();
        expect(ss.children.length).toBe(2);
    })

    it('sort styles', () => {
        const ss = new StyleSheet(['.test', '.abc', 'html', '*', ':root', '::moz-focus-inner', undefined].map(i=>new Style(i)));
        expect(ss.sort().children.map(i=>i.selector)).toEqual(['*', ':root', '::moz-focus-inner', 'html', '.test', '.abc', undefined]);
    })

    it('build', () => {
        const ss = new StyleSheet([s1, s2, s3]);
        expect(ss.build()).toBe('.bg-white {\n  --bg-opacity: 1;\n  background-color: rgba(255, 255, 255, var(--tw-bg-opacity));\n}\n.py-10 {\n  padding-top: 2.5rem;\n  padding-bottom: 2.5rem;\n}')
    })

    it('minimize build', () => {
        const ss = new StyleSheet([s1, s2, s3]);
        expect(ss.build(true)).toBe('.bg-white{--bg-opacity:1;background-color:rgba(255, 255, 255, var(--tw-bg-opacity))}.py-10{padding-top:2.5rem;padding-bottom:2.5rem}')
    })
})