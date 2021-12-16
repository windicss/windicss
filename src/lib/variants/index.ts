import { generateOrientations } from './orientation';
import { generateScreens } from './screen';
import { generateThemes } from './theme';
import { generateStates } from './state';

import type { Style } from '../../utils/style';
import type { BaseTheme, Config, DictStr } from '../../interfaces';

export type Variants = {
  orientation: { [key: string]: () => Style };
  screen: { [key: string]: () => Style };
  theme: { [key: string]: () => Style };
  state: { [key: string]: () => Style };
}

export function resolveVariants(config: Config): Variants {
  return {
    orientation: generateOrientations(((config.theme as BaseTheme)?.orientation ?? {})),
    screen: generateScreens(((config.theme as BaseTheme)?.screens ?? {}) as DictStr),
    theme: generateThemes(config.darkMode),
    state: generateStates(config.variantOrder ?? []),
  };
}

export {
  generateOrientations,
  generateScreens,
  generateThemes,
  generateStates,
};
