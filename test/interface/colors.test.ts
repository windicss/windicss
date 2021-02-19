import colors from '../../dist/colors';

describe('color interface test', () => {
  it('import', () => {
    expect(colors.black).toEqual('#000');
  });

  it('require', () => {
    const colors = require('../../dist/colors');
    expect(colors.black).toEqual('#000');
  });
});

snapshotContext(__filename);
