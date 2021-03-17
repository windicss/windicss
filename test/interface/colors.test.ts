import colors from '../../dist/colors';
import darkColors from '../../dist/darkColors';

describe('color interface test', () => {
  it('import', () => {
    expect(colors.black).toEqual('#000');
  });

  it('require', () => {
    const colors = require('../../dist/colors');
    expect(colors.black).toEqual('#000');
  });

  it('import', () => {
    expect(darkColors.black).toEqual('#000');
  });

  it('require', () => {
    const darkColors = require('../../dist/darkColors');
    expect(darkColors.black).toEqual('#000');
  });
});
