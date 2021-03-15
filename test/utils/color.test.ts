import { toRGB, toRGBA, toColor } from '../../src/utils/color';

describe('color utils', () => {
  it('convert color', () => {
    const colors = {
      name: 'blue',
      hex: '#1c1c1e',
      hexa: '#0000ff00',
      rgb: 'rgb(23, 23, 24)',
      rgba: 'rgba(23, 23, 25, 0.5)',
      hsl: 'hsl(120, 100%, 50%)',
      hsla: 'hsla(120, 100%, 75%, 0.3)',
      hwb: 'hwb(280, 40%, 60%)',
      hwba: 'hwb(280, 40%, 60%, 0)',
      srgb: 'rgb(69.99%, 32%, 32%)',
    };
    expect(Object.values(colors).map(i => toRGBA(i))).toEqual([
      [ 0, 0, 255, 1 ],
      [ 28, 28, 30, 1 ],
      [ 0, 0, 255, 0],
      [ 23, 23, 24, 1 ],
      [ 23, 23, 25, 0.5 ],
      [ 0, 255, 0, 1],
      [ 128, 255, 128, 0.3],
      [ 102, 102, 102, 1 ],
      [ 102, 102, 102, 0 ],
      [ 178, 82, 82, 1 ],
    ]);

    expect(toRGB('#1c1c1e')).toEqual([ 28, 28, 30]);
    expect(toColor('rgba(23, 23, 25, 0.5)')).toEqual({
      color: '23, 23, 25',
      opacity: '0.5',
    });
  });
});
