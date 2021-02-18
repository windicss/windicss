import { Processor } from '../../src/lib';
import { readFileSync } from 'fs';

const html = readFileSync('./test/assets/example.html').toString();
const processor = new Processor();

describe('Preflight', () => {
  it('some tags', () => {
    expect(
      processor
        .preflight(html)
        .build()
    ).toEqual(readFileSync('./test/assets/examplePreflight.css').toString());

    expect(
      processor
        .preflight(
          html,
          true,
          false
        )
        .build()
    ).toEqual(
      `a {
  color: inherit;
  text-decoration: inherit;
}
code {
  font-size: 1em;
  font-family: ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;
}
img {
  border-style: solid;
  max-width: 100%;
  height: auto;
}
img, svg {
  display: block;
}
p {
  margin: 0;
}
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}`
    );

    expect(
      processor
        .preflight(
          html, false, false, false
        )
        .build()
    ).toEqual('');
  });

  it('all tags', () => {
    expect(processor.preflight().build()).toEqual(
      readFileSync('./test/assets/preflight.css').toString()
    );
  });
});
