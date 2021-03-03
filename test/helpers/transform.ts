import { convert } from '../../src/helpers';

describe('transform', () => {
  it('convert code', () => {
    expect(convert('const plugin = require(\'tailwindcss/plugin\')')).toEqual('const plugin = require(\'windicss/plugin\')');
    expect(convert('const colors = require(\'tailwindcss/colors\')')).toEqual('const colors = require(\'windicss/colors\')');
    expect(convert(`
      const resolveConfig = require('tailwindcss/resolveConfig');
      const defaultTheme = require('tailwindcss/defaultTheme');
      const typography = require('@tailwindcss/typography');
    `)).toEqual(`
      const resolveConfig = require('windicss/resolveConfig');
      const defaultTheme = require('windicss/defaultTheme');
      const typography = require('windicss/plugin/typography');
    `);
  });
});
