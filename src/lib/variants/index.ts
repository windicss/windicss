import { default as generateScreens } from "./screen";
import { default as generateThemes } from "./theme";
import { default as generateStates } from "./state";

import type { Style } from "../../utils/style";
import type { Config, DictStr } from "../../interfaces";

export { default as generateScreens } from "./screen";
export { default as generateThemes } from "./theme";
export { default as generateStates } from "./state";

export function resolveVariants(
  config: Config
): {
  screen: { [key: string]: () => Style };
  theme: { [key: string]: () => Style };
  state: { [key: string]: () => Style };
} {
  return {
    screen: generateScreens((config.theme?.screens ?? {}) as DictStr),
    theme: generateThemes(config.darkMode),
    state: generateStates(config.variantOrder ?? []),
  };
}
