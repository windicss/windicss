import { Style } from '../../utils/style';

export default function (darkMode:'media'|'class') {
    return {
        '@dark': () => new Style().atRule('@media (prefers-color-scheme: dark)'),
        '@light': () => new Style().atRule('@media (prefers-color-scheme: light)'),
        '.dark': () => new Style().parent('.dark'),
        '.light': () => new Style().parent('.light'),
        'dark': () => darkMode === 'media' ? new Style().atRule('@media (prefers-color-scheme: dark)') : new Style().parent('.dark'),
        'light': () => darkMode === 'media' ? new Style().atRule('@media (prefers-color-scheme: light)') : new Style().parent('.light'),
    } as {[key:string]:()=>Style}
};
