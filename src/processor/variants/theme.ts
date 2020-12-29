import { Style } from '../../utils/style';

export default {
    '@dark': () => new Style().atRule('@media (prefers-color-scheme: dark)'),
    '@light': () => new Style().atRule('@media (prefers-color-scheme: light)'),
    'dark': () => new Style().parent('.dark'),
    'light': () => new Style().parent('.light'),
} as {[key:string]:()=>Style}
