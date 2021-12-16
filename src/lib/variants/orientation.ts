import { Style } from '../../utils/style';

export function generateOrientations(orientations: {
  [key: string]: string
}): { [key: string]: () => Style } {
  const variants : { [key: string]: () => Style } = {};

  Object.entries(orientations).forEach(([name, orientation]) => {
    variants[name] = () => new Style().atRule(`@media (orientation: ${orientation})`);
  });

  return variants;
}