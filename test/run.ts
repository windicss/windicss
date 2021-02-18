// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@types/jasmine/index.d.ts" />

import Jasmine from "jasmine";
import { resolve } from "path";
import {
  finishSnapshots,
  compareDiff,
  compareSnapshot,
  context,
} from "./snapshot";

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
        compare: compareSnapshot,
      };
    },
  });
});

const _describe = jasmine.env.describe.bind(jasmine.env);
const _it = jasmine.env.it.bind(jasmine.env);
jasmine.env.describe = (msg, fn) =>
  _describe(msg, () => {
    context.describe = msg;
    return fn();
  });
jasmine.env.it = (msg, fn) =>
  _it(msg, () => {
    context.it = msg;
    return fn();
  });


jasmine.configureDefaultReporter({ showColors: true });
jasmine.loadConfigFile(resolve(__dirname, "..", "jasmine.json"));
jasmine.onComplete(finishSnapshots);
jasmine.execute();
