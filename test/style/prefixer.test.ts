import { linearGradient, minMaxContent } from '../../src/utils/style';

describe('linearGradient', () => {
    it('gradient input', () => {
        const p = linearGradient('linear-gradient(to left, var(--tw-gradient-stops))');
        expect(p).toEqual(['-o-linear-gradient(right, var(--tw-gradient-stops))', '-webkit-gradient(linear, right top, left top, from(var(--tw-gradient-stops)))', 'linear-gradient(to left, var(--tw-gradient-stops))'])
    })

    it('not gradient input', () => {
        const p = linearGradient('background-color');
        expect(p).toEqual('background-color');
    })
})

describe('minMaxContent', () => {
    it('min-content', () => {
        const p = minMaxContent('min-content');
        expect(p).toEqual(['-webkit-min-content', 'min-content'])
    })

    it('max-content', () => {
        const p = minMaxContent('max-content');
        expect(p).toEqual(['-webkit-max-content', 'max-content']);
    })

    it('others', () => {
        const p = minMaxContent('background-color');
        expect(p).toEqual('background-color');
    })
})