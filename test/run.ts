// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../node_modules/@types/jasmine/index.d.ts" />

import Jasmine from "jasmine";
import { basename, dirname, join, resolve } from "path";
import fs from "fs-extra";
import yaml from "js-yaml";
import chalk from "chalk";
import { diffLines } from "diff";

/**
 * Test Snapshot usage:
 *
 * ```ts
 * expectToMatchSnapshot(styleSheet.build(), "css", __filename);
 * ```
 */

const updateSnapshot = !!process.env.UPDATE_SNAPSHOT;

const jasmine = new Jasmine(undefined);

beforeEach(() => {
  jasmine.addMatchers({
    toEqualDiff() {
      return {
        compare<T extends string>(actual: T, expected: T, reason: string) {
          if (actual == expected) {
            return {
              pass: true,
            };
          } else {
            const diff = diffLines(expected, actual);
            let messages = chalk.yellow(reason) + "\n\n";
            diff.forEach((part) => {
              const color = part.added
                ? "green"
                : part.removed
                ? "red"
                : "gray";
              messages += chalk.gray[color](part.value);
            });
            return {
              pass: false,
              message: messages,
            };
          }
        },
      };
    },
  });
});

jasmine.configureDefaultReporter({
  showColors: true,
});
jasmine.loadConfigFile(resolve(__dirname, "..", "jasmine.json"));

let describe = "";
let it = "";

const _describe = jasmine.env.describe.bind(jasmine.env);
const _it = jasmine.env.it.bind(jasmine.env);
jasmine.env.describe = (msg, fn) => {
  return _describe(msg, () => {
    describe = msg;
    return fn();
  });
};
jasmine.env.it = (msg, fn) => {
  return _it(msg, () => {
    it = msg;
    return fn();
  });
};

type SnapshotData = Record<string, string>;

interface SnapshotInfo {
  path: string;
  data: SnapshotData;
  changed: boolean;
  touched: Set<string>;
}

const snapshotCache: Record<string, SnapshotInfo> = {};

function prepreSnapshot(path: string) {
  if (!snapshotCache[path]) {
    let data: SnapshotData = {};
    let changed = false;

    fs.ensureDirSync(dirname(path));
    if (fs.existsSync(path)) {
      // @ts-expect-error anyway
      data = yaml.load(fs.readFileSync(path, "utf-8")) || {};
    } else {
      changed = true;
    }

    snapshotCache[path] = {
      path,
      data,
      changed,
      touched: new Set(),
    };
  }

  return snapshotCache[path];
}

function finishSnapshots() {
  for (const snap of Object.values(snapshotCache)) {
    // some case are not touched
    if (!snap.changed && Object.keys(snap).some((i) => !snap.touched.has(i))) {
      snap.changed = true;
    }
    if (!snap.changed) continue;

    const data: SnapshotData = {};

    for (const key of snap.touched.values()) {
      data[key] = snap.data[key];
    }

    fs.writeFile(snap.path, yaml.dump(data), "utf-8");
  }
}

// @ts-expect-error extend
global.expectToMatchSnapshot = jasmine.env.expectToMatchSnapshot = (
  value: unknown,
  name: string,
  file: string
) => {
  const fullname = [describe, it, name].join(": ");
  const snapPath = join(
    dirname(file),
    "__snapshots__",
    basename(file) + ".yml"
  );
  const snap = prepreSnapshot(snapPath);

  if (typeof value !== "string") {
    value = JSON.stringify(value, null, 2);
  }

  if (snap.data[fullname] != null && !updateSnapshot) {
    expect(snap.data[fullname]).toEqualDiff(
      value as string,
      `Snapshot "${fullname}" mismatched`
    );
  } else {
    snap.data[fullname] = value as string;
    snap.changed = true;
  }

  snap.touched.add(fullname);
};

jasmine.onComplete(() => {
  finishSnapshots();
});

jasmine.execute();
