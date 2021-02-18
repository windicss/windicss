import { generateScreens } from './screen';
import { generateThemes } from './theme';
import { generateStates } from './state';

import type { Style } from '../../utils/style';
import type { Config, DictStr } from '../../interfaces';

export type Variants = {
  screen: { [key: string]: () => Style };
  theme: { [key: string]: () => Style };
  state: { [key: string]: () => Style };
}

export function resolveVariants(config: Config): Variants {
  return {
    screen: generateScreens((config.theme?.screens ?? {}) as DictStr),
    theme: generateThemes(config.darkMode),
    state: generateStates(config.variantOrder ?? []),
  };
}

export { 
  generateScreens,
  generateThemes,
  generateStates,
};
