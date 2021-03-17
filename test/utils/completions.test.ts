import { Processor } from '../../src/lib';
import { generateCompletions  } from '../../src/utils/completions';

describe('generate completions', () => {
  it('completions', () => {
    const processor = new Processor();
    const completions = generateCompletions(processor);
    expect(completions.static).toMatchSnapshot('static');
    expect(completions.dynamic).toMatchSnapshot('dynamic');
    expect(completions.color).toMatchSnapshot('color');
  });
});
