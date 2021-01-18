import { default as screensGenerator } from './screen';
import { default as themesGenerator } from './theme';
import { default as statesGenerator } from './state';

import type { Config } from '../../interfaces';

export default function resolveVariants(config:Config) {
    return {
        'screen': screensGenerator(config.theme?.screens ?? {}),
        'theme': themesGenerator(config.darkMode ?? 'class'),
        'state': statesGenerator(config.variantOrder ?? [])
    }
}