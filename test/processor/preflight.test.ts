import { Processor } from '../../src/lib';
import { readFileSync } from 'fs';

const html = readFileSync('./test/assets/example.html').toString();
const processor = new Processor();

describe('Preflight', () => {
  it('some tags', () => {
    expect(processor.preflight(html).build()).toEqual(readFileSync('./test/assets/examplePreflight.css').toString());

    expect(processor.preflight(html,true,false).build()).toMatchSnapshot('css');
    expect(processor.preflight(html, false, false, false).build()).toEqual('');
  });

  it('all tags', () => {
    expect(processor.preflight().build()).toEqual(
      readFileSync('./test/assets/preflight.css').toString()
    );
  });
});
