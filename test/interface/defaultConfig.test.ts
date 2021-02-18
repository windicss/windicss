import defaultConfig from '../../dist/defaultConfig';

describe('defaultConfig interface test', () => {
  it('import', () => {
    expect(defaultConfig.darkMode).toEqual('class');
  });

  it('extend', () => {
    expect(defaultConfig.darkMode).toBe('class');
    expect(Object.keys(defaultConfig.theme.borderColor).length).toEqual(Object.keys(defaultConfig.theme.colors).length+1);
  });

  it('require', () => {
    const defaultConfig = require('../../dist/defaultConfig');
    expect(defaultConfig.darkMode).toEqual('class');
  });

  it('require extend', () => {
    const defaultConfig = require('../../dist/defaultConfig');
    expect(Object.keys(defaultConfig.theme.borderColor).length).toEqual(Object.keys(defaultConfig.theme.colors).length+1);
  });
});
