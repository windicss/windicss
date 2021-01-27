import { Style } from "../../utils/style";

export default function generateScreens(screens: {
  [key: string]: string;
}): { [key: string]: () => Style } {
  const variants: { [key: string]: () => Style } = {};
  const identifiers = Object.keys(screens).sort((a: string, b: string) => {
    return parseInt(screens[a]) - parseInt(screens[b]);
  });

  identifiers.forEach((key, index) => {
    const size = screens[key];
    variants[key] = () => new Style().atRule(`@media (min-width: ${size})`);
    variants["-" + key] = () =>
      new Style().atRule(`@media (max-width: ${size})`);
    variants["+" + key] = () =>
      new Style().atRule(
        identifiers[index + 1]
          ? `@media (min-width: ${size}) and (max-width: ${
              screens[identifiers[index + 1]]
            })`
          : `@media (min-width: ${size})`
      );
  });

  return variants;
}
