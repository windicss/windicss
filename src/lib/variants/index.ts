import { default as generateScreens } from './screen';
import { default as generateThemes } from './theme';
import { default as generateStates } from './state';

import type { Config } from '../../interfaces';

export { default as generateScreens } from './screen';
export { default as generateThemes } from './theme';
export { default as generateStates } from './state';

export function resolveVariants(config:Config) {
    return {
        'screen': generateScreens(config.theme?.screens ?? {}),
        'theme': generateThemes(config.darkMode),
        'state': generateStates(config.variantOrder ?? [])
    }
}