import fg from 'fast-glob';
import fs from 'fs-extra';
import { resolve } from 'path';

async function run() {
  const root = resolve(__dirname, '../dist/types');
  const target = resolve(__dirname, '../dist');
  const files = await fg('**/*.d.ts', {
    cwd: root,
    onlyFiles: true,
  });

  await Promise.all(
    files.map(file => fs.move(
      resolve(root, file),
      resolve(target, file),
      { overwrite: true }
    ))
  );

  await fs.remove(root);
}

run();
