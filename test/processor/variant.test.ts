import { Property } from '../../src/utils/style';
import type { Style } from '../../src/utils/style';
import { base } from '../../src/config';
import { 
    generateScreens,
    generateStates,
    generateThemes,
    resolveVariants
} from '../../src/lib/variants';

import fs from 'fs';

function _generateTestVariants(variants:{[key:string]:()=>Style}) {
    const output:{[key:string]:string} = {};
    for (let [name, func] of Object.entries(variants)) {
        const style = func();
        style.selector = '.test';
        style.add(new Property('background', '#1C1C1E'));
        output[name] = style.build();
    }
    return output;
}

describe('Variants', () => {
    it('generate screens', () => {
        const screens = generateScreens({
            sm: '640px',
            lg: '1024px',
        });
        expect(_generateTestVariants(screens)).toEqual({
            'sm': '@media (min-width: 640px) {\n  .test {\n    background: #1C1C1E;\n  }\n}',
            '-sm': '@media (max-width: 640px) {\n  .test {\n    background: #1C1C1E;\n  }\n}',
            '+sm': '@media (min-width: 640px) and (max-width: 1024px) {\n  .test {\n    background: #1C1C1E;\n  }\n}',
            'lg': '@media (min-width: 1024px) {\n  .test {\n    background: #1C1C1E;\n  }\n}',
            '-lg': '@media (max-width: 1024px) {\n  .test {\n    background: #1C1C1E;\n  }\n}',
            '+lg': '@media (min-width: 1024px) {\n  .test {\n    background: #1C1C1E;\n  }\n}',
        })

        const unsortedScreens = generateScreens({
            lg: '1024px',
            sm: '640px',
        });
        expect(Object.keys(unsortedScreens)).toEqual(['sm', '-sm', '+sm', 'lg', '-lg', '+lg']);
    })

    it('generate themes with darkMode class', () => {
        const themes = generateThemes('class');
        expect(_generateTestVariants(themes)).toEqual({
            '@dark': '@media (prefers-color-scheme: dark) {\n  .test {\n    background: #1C1C1E;\n  }\n}',
            '@light': '@media (prefers-color-scheme: light) {\n  .test {\n    background: #1C1C1E;\n  }\n}',
            '.dark': '.dark .test {\n  background: #1C1C1E;\n}',
            '.light': '.light .test {\n  background: #1C1C1E;\n}',
            'dark': '.dark .test {\n  background: #1C1C1E;\n}',
            'light': '.light .test {\n  background: #1C1C1E;\n}'
        })
    })

    it('generate themes with darkMode media', () => {
        const themes = generateThemes('media');
        expect(_generateTestVariants(themes)).toEqual({
            '@dark': '@media (prefers-color-scheme: dark) {\n  .test {\n    background: #1C1C1E;\n  }\n}',
            '@light': '@media (prefers-color-scheme: light) {\n  .test {\n    background: #1C1C1E;\n  }\n}',
            '.dark': '.dark .test {\n  background: #1C1C1E;\n}',
            '.light': '.light .test {\n  background: #1C1C1E;\n}',
            'dark': '@media (prefers-color-scheme: dark) {\n  .test {\n    background: #1C1C1E;\n  }\n}',
            'light': '@media (prefers-color-scheme: light) {\n  .test {\n    background: #1C1C1E;\n  }\n}'
        })
    })

    it('generate states', () => {
        const allStates = generateStates(base.variantOrder??[]);
        expect(Object.keys(allStates)).toEqual(base.variantOrder??[]);

        expect(_generateTestVariants(allStates)).toEqual({
            "hover": ".test:hover {\n  background: #1C1C1E;\n}",
            "focus": ".test:focus {\n  background: #1C1C1E;\n}",
            "active": ".test:active {\n  background: #1C1C1E;\n}",
            "visited": ".test:visited {\n  background: #1C1C1E;\n}",
            "link": ".test:link {\n  background: #1C1C1E;\n}",
            "target": ".test:target {\n  background: #1C1C1E;\n}",
            "focus-visible": ".test:focus-visible {\n  background: #1C1C1E;\n}",
            "focus-within": ".test:focus-within {\n  background: #1C1C1E;\n}",
            "checked": ".test:checked {\n  background: #1C1C1E;\n}",
            "not-checked": ".test:not(:checked) {\n  background: #1C1C1E;\n}",
            "default": ".test:default {\n  background: #1C1C1E;\n}",
            "disabled": ".test:disabled {\n  background: #1C1C1E;\n}",
            "enabled": ".test:enabled {\n  background: #1C1C1E;\n}",
            "indeterminate": ".test:indeterminate {\n  background: #1C1C1E;\n}",
            "invalid": ".test:invalid {\n  background: #1C1C1E;\n}",
            "valid": ".test:valid {\n  background: #1C1C1E;\n}",
            "optional": ".test:optional {\n  background: #1C1C1E;\n}",
            "required": ".test:required {\n  background: #1C1C1E;\n}",
            "placeholder-shown": ".test:placeholder-shown {\n  background: #1C1C1E;\n}",
            "read-only": ".test:read-only {\n  background: #1C1C1E;\n}",
            "read-write": ".test:read-write {\n  background: #1C1C1E;\n}",
            "not-disabled": ".test:not(:disabled) {\n  background: #1C1C1E;\n}",
            "first-of-type": ".test:first-of-type {\n  background: #1C1C1E;\n}",
            "not-first-of-type": ".test:not(:first-of-type) {\n  background: #1C1C1E;\n}",
            "last-of-type": ".test:last-of-type {\n  background: #1C1C1E;\n}",
            "not-last-of-type": ".test:not(:last-of-type) {\n  background: #1C1C1E;\n}",
            "first": ".test:first-child {\n  background: #1C1C1E;\n}",
            "last": ".test:last-child {\n  background: #1C1C1E;\n}",
            "not-first": ".test:not(:first-child) {\n  background: #1C1C1E;\n}",
            "not-last": ".test:not(:last-child) {\n  background: #1C1C1E;\n}",
            "only-child": ".test:only-child {\n  background: #1C1C1E;\n}",
            "not-only-child": ".test:not(:only-child) {\n  background: #1C1C1E;\n}",
            "only-of-type": ".test:only-of-type {\n  background: #1C1C1E;\n}",
            "not-only-of-type": ".test:not(:only-of-type) {\n  background: #1C1C1E;\n}",
            "even": ".test:nth-child(even) {\n  background: #1C1C1E;\n}",
            "odd": ".test:nth-child(odd) {\n  background: #1C1C1E;\n}",
            "even-of-type": ".test:nth-of-type(even) {\n  background: #1C1C1E;\n}",
            "odd-of-type": ".test:nth-of-type(odd) {\n  background: #1C1C1E;\n}",
            "root": ".test:root {\n  background: #1C1C1E;\n}",
            "empty": ".test:empty {\n  background: #1C1C1E;\n}",
            "before": ".test::before {\n  background: #1C1C1E;\n}",
            "after": ".test::after {\n  background: #1C1C1E;\n}",
            "first-letter": ".test::first-letter {\n  background: #1C1C1E;\n}",
            "first-line": ".test::first-line {\n  background: #1C1C1E;\n}",
            "selection": ".test::selection {\n  background: #1C1C1E;\n}",
            "svg": ".test svg {\n  background: #1C1C1E;\n}",
            "all": ".test * {\n  background: #1C1C1E;\n}",
            "all-child": ".test > * {\n  background: #1C1C1E;\n}",
            "sibling": ".test ~ * {\n  background: #1C1C1E;\n}",
            "group-hover": ".group:hover .test {\n  background: #1C1C1E;\n}",
            "group-focus": ".group:focus .test {\n  background: #1C1C1E;\n}",
            "group-active": ".group:active .test {\n  background: #1C1C1E;\n}",
            "group-visited": ".group:visited .test {\n  background: #1C1C1E;\n}",
            "motion-safe": "@media (prefers-reduced-motion: no-preference) {\n  .test {\n    background: #1C1C1E;\n  }\n}",
            "motion-reduce": "@media (prefers-reduced-motion: reduce) {\n  .test {\n    background: #1C1C1E;\n  }\n}"
        })

        const someStates = generateStates(['focus', 'hover', 'before', 'svg', 'group-hover', 'motion-safe', 'wrong']);
        expect(_generateTestVariants(someStates)).toEqual({
            'focus': '.test:focus {\n  background: #1C1C1E;\n}',
            'hover': '.test:hover {\n  background: #1C1C1E;\n}',
            'before': '.test::before {\n  background: #1C1C1E;\n}',
            'svg': '.test svg {\n  background: #1C1C1E;\n}',
            'group-hover': '.group:hover .test {\n  background: #1C1C1E;\n}',
            'motion-safe': '@media (prefers-reduced-motion: no-preference) {\n  .test {\n    background: #1C1C1E;\n  }\n}'
        })
    })

    it('resolve variants', () => {
        const variants = resolveVariants(base);
        expect(Object.keys(variants)).toEqual(['screen', 'theme', 'state']);
        expect(Object.keys(variants.screen)).toEqual(['sm', '-sm', '+sm', 'md', '-md', '+md', 'lg', '-lg', '+lg', 'xl', '-xl', '+xl', '2xl', '-2xl', '+2xl']);
        expect(Object.keys(variants.theme)).toEqual(['@dark', '@light', '.dark', '.light', 'dark', 'light']);
        expect(Object.keys(variants.state)).toEqual(base.variantOrder??[])
       
        const emptyVariants = resolveVariants({});
        expect(emptyVariants.screen).toEqual({});
        expect(emptyVariants.theme).toEqual({});
        expect(emptyVariants.state).toEqual({});

    });
})