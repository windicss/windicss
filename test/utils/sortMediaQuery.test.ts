import { sortMediaQuery } from '../../src/utils/algorithm';

const screens = [
  // no units
  '@media (orientation: landscape)',
  '@media (orientation: portrait)',
  '@media print',
  '@media only print',
  '@media tv',

  // device
  '@media (min-device-width: 320px) and (max-device-width: 767px)',

  // max-width/-height <- from largest to smallest
  '@media (max-width: 1023px)',
  '@media (max-height: 767px) and (min-height: 320px)',
  '@media (max-width: 767px) and (min-width: 320px)',
  '@media (max-width: 639px)',

  '@media (min-width: 320px) and (max-width: 767px)',
  '@media (min-height: 480px)',
  '@media (min-height: 480px) and (min-width: 320px)',
  '@media (min-width: 1024px)',
  '@media (min-width: 1280px)',
  '@media (min-width: 640px)',
  '@media (prefers-color-schemes: dark)',
  '@media (prefers-color-schemes: light)',
  '@keyframes spin',
];

describe('sortMediaQuery', () => {
  it('sort', () => {
    expect(screens.sort(sortMediaQuery)).toMatchSnapshot('query', __filename);
  });
});
