import { resolve } from 'path';
import { Processor } from '../../src/lib';

const configPath = resolve('./test/config/tailwind.config.js');
const userConfig = require(configPath);

describe('Processor', () => {
    const baseConfig = new Processor();

    it('config file', () => {
        const processor = new Processor(configPath);
        expect(processor.config('theme.screens')).toEqual(processor.theme('screens'));
        expect(processor.theme('screens')).toEqual(userConfig.theme.screens);
        expect(processor.theme('colors')).toEqual(userConfig.theme.colors);
        expect(processor.theme('colors.pink')).toEqual(userConfig.theme.colors.pink);
        expect(processor.theme('fontFamily')).toEqual(userConfig.theme.fontFamily);
        expect(processor.theme('spacing')).toEqual({...baseConfig.theme('spacing'), ...userConfig.theme.extend.spacing});
        expect(processor.theme('borderRadius')).toEqual({...baseConfig.theme('borderRadius'), ...userConfig.theme.extend.borderRadius});
    })

    it('config dict', () => {
        const processor = new Processor(userConfig);
        expect(processor.config('theme.screens')).toEqual(processor.theme('screens'));
        expect(processor.theme('screens')).toEqual(userConfig.theme.screens);
        expect(processor.theme('colors')).toEqual(userConfig.theme.colors);
        expect(processor.theme('colors.pink')).toEqual(userConfig.theme.colors.pink);
        expect(processor.theme('fontFamily')).toEqual(userConfig.theme.fontFamily);
        expect(processor.theme('spacing')).toEqual({...baseConfig.theme('spacing'), ...userConfig.theme.extend.spacing});
        expect(processor.theme('borderRadius')).toEqual({...baseConfig.theme('borderRadius'), ...userConfig.theme.extend.borderRadius});
    })

    it('sort screens', () => {
        const processor = new Processor({
            theme: {
                screens: {
                    lg: '976px',
                    xl: '1440px',
                    sm: '480px',
                    md: '768px',
                }
            }
        })
        expect(Object.entries(processor.theme('screens'))).toEqual([[ 'sm', '480px' ], [ 'md', '768px' ], [ 'lg', '976px' ], [ 'xl', '1440px' ]]);
    })
});