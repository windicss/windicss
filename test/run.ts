// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@types/jasmine/index.d.ts" />

import Jasmine from 'jasmine';
import { addHook } from 'pirates';
import { resolve } from 'path';
import { compareDiff, compareSnapshot, context, finishSnapshots } from './snapshot';

addHook(
  (code, ) => code.replace(/(?<=toMatchSnapshot\([^,)]+)\)/g, ', __filename)'),
  { exts: ['.ts'], ignoreNodeModules: true }
);

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
jasmine.env.describe = (msg: string, fn: () => void) => _describe(msg, () => {
  context.describe = msg;
  context.count = 0;
  return fn();
});
jasmine.env.it = (msg: string, fn: () => void) => _it(msg, () => {
  context.it = msg;
  context.count = 0;
  return fn();
});

jasmine.loadConfigFile(resolve(__dirname, '..', 'jasmine.json'));
jasmine.configureDefaultReporter({ showColors: true });
jasmine.loadConfig(resolve(__dirname, '..', 'jasmine.json'));
jasmine.onComplete((passed) => {
  finishSnapshots(passed);
  if (!passed) setTimeout(() => process.exit(1));
});
jasmine.execute();
