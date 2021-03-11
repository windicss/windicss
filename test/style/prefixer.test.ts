import { Processor } from '../../src/lib';
import { linearGradient, minMaxContent, Property, Style, StyleSheet } from '../../src/utils/style';

describe('linearGradient', () => {
  it('gradient input', () => {
    const p = linearGradient(
      'linear-gradient(to left, var(--tw-gradient-stops))'
    );
    expect(p).toEqual([
      '-o-linear-gradient(right, var(--tw-gradient-stops))',
      '-webkit-gradient(linear, right top, left top, from(var(--tw-gradient-stops)))',
      'linear-gradient(to left, var(--tw-gradient-stops))',
    ]);
  });

  it('not gradient input', () => {
    const p = linearGradient('background-color');
    expect(p).toEqual('background-color');
  });
});

describe('minMaxContent', () => {
  it('min-content', () => {
    const p = minMaxContent('min-content');
    expect(p).toEqual(['-webkit-min-content', 'min-content']);
  });

  it('max-content', () => {
    const p = minMaxContent('max-content');
    expect(p).toEqual(['-webkit-max-content', 'max-content']);
  });

  it('others', () => {
    const p = minMaxContent('background-color');
    expect(p).toEqual('background-color');
  });
});

describe('closePrefixer', () => {
  it('style prefix', () => {
    const style = new Style('.flex', [
      new Property('display', '-webkit-box'),
      new Property('dispaly', '-ms-flexbox'),
      new Property('display', '-webkit-flex'),
      new Property('display', 'flex'),
    ]);
    expect(style.build(false, false)).toEqual(
      `.flex {
  display: flex;
}`);
  });

  it('styleSheet prefix', () => {
    const styleSheet = new StyleSheet();
    styleSheet.add(new Style('.flex', [
      new Property('display', '-webkit-box'),
      new Property('dispaly', '-ms-flexbox'),
      new Property('display', '-webkit-flex'),
      new Property('display', 'flex'),
    ]));
    styleSheet.add(new Style('.bg-clip-padding', [
      new Property('-webkit-background-clip', 'padding-box'),
      new Property('background-clip', 'padding-box'),
    ]));
    styleSheet.prefixer = false;
    expect(styleSheet.build()).toMatchSnapshot('css');
  });

  it('processor prefix', () => {
    const processor = new Processor({
      prefixer: false,
    });
    expect(processor.preflight(undefined, true, true).build()).toMatchSnapshot('preflight');
    expect(processor.interpret('bg-clip-padding flex bg-gradient-to-bl animate-ping placeholder-gray-200').styleSheet.build()).toMatchSnapshot('css');
  });
});
