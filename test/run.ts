// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@types/jasmine/index.d.ts" />

import Jasmine from 'jasmine';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import {
  finishSnapshots,
  compareDiff,
  compareSnapshot,
  context,
} from './snapshot';

const INJECT_SNIPPET = 'snapshotContext(__filename)';

const jasmine = new Jasmine(undefined);

beforeEach(() => {
  jasmine.addMatchers({
    toEqualDiff() {
      return {
        compare: compareDiff,
      };
    },
    toMatchSnapshot() {
      return {
        compare: (value: unknown, name: string, file: string) => {
          return compareSnapshot(value, name, file);
        },
      };
    },
  });
});

const _describe = jasmine.env.describe.bind(jasmine.env);
const _it = jasmine.env.it.bind(jasmine.env);
jasmine.env.describe = (msg, fn) =>_describe(msg, () => {
  context.describe = msg;
  context.count = 0;
  return fn();
});
jasmine.env.it = (msg, fn) => _it(msg, () => {
  context.it = msg;
  context.count = 0;
  return fn();
});
global.snapshotContext = (filepath) => context.filepath = filepath;

jasmine.loadConfigFile(resolve(__dirname, '..', 'jasmine.json'));
jasmine.configureDefaultReporter({ showColors: true });
jasmine.loadConfig(resolve(__dirname, '..', 'jasmine.json'));
jasmine.specFiles.forEach(file => {
  const content = readFileSync(file, 'utf-8');
  if (!content.includes(INJECT_SNIPPET))
    writeFileSync(file, content.trimEnd() + `\n\n${INJECT_SNIPPET};\n`, 'utf-8');
});
jasmine.onComplete(finishSnapshots);
jasmine.execute();
