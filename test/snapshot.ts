import { basename, dirname, join } from 'path';
import fs from 'fs-extra';
import yaml from 'js-yaml';
import chalk from 'chalk';
import { diffLines } from 'diff';

/**
 * Test Snapshot usage:
 *
 * ```ts
 * expect(styleSheet.build()).toMatchSnapshot("css");
 * ```
 */

type SnapshotData = Record<string, string>;

interface SnapshotInfo {
  path: string;
  data: SnapshotData;
  changed: boolean;
  touched: Set<string>;
}

export const updateSnapshot = !!process.env.UPDATE_SNAPSHOT;
export const context = {
  describe: '',
  it: '',
  count: 0,
};

const snapshotCache: Record<string, SnapshotInfo> = {};

export function compareDiff<T extends string>(
  actual: T,
  expected: T,
  reason = 'mismatch'
): jasmine.CustomMatcherResult {
  if (actual === expected) {
    return { pass: true };
  }

  const diff = diffLines(expected, actual);
  let messages = chalk.yellow(reason) + '\n\n';
  diff.forEach((part) => {
    const color = part.added ? 'green' : part.removed ? 'red' : 'gray';
    messages += chalk.gray[color](part.value);
  });
  return {
    pass: false,
    message: messages,
  };
}

export function compareSnapshot(
  value: unknown,
  name: string,
  file: string
): jasmine.CustomMatcherResult {
  const fullname = [context.describe, context.it, name, context.count].join(
    ' / '
  );
  context.count += 1;
  const snapPath = join(
    dirname(file),
    '__snapshots__',
    basename(file) + '.yml'
  );
  const snap = prepreSnapshot(snapPath);

  if (typeof value !== 'string') {
    value = JSON.stringify(value, null, 2);
  }
  snap.touched.add(fullname);

  if (snap.data[fullname] != null && !updateSnapshot) {
    return compareDiff(
      snap.data[fullname],
      value as string,
      `Snapshot "${fullname}" mismatched`
    );
  } else {
    snap.data[fullname] = value as string;
    snap.changed = true;
  }

  return { pass: true };
}

export function prepreSnapshot(path: string): SnapshotInfo {
  if (!snapshotCache[path]) {
    let data: SnapshotData = {};
    let changed = false;

    fs.ensureDirSync(dirname(path));
    if (fs.existsSync(path)) {
      // @ts-expect-error anyway
      data = yaml.load(fs.readFileSync(path, 'utf-8')) || {};
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

export function finishSnapshots(): void {
  for (const snap of Object.values(snapshotCache)) {
    // some case are not touched
    if (!snap.changed && Object.keys(snap).some((i) => !snap.touched.has(i))) {
      snap.changed = true;
    }
    if (!snap.changed) continue;

    const data: SnapshotData = {};

    const keys = Array.from(snap.touched.values()).sort();
    for (const key of keys) {
      data[key] = snap.data[key];
    }

    fs.writeFile(snap.path, yaml.dump(data), 'utf-8');
  }
}
