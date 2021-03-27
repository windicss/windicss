/* eslint-disable no-console */
import { Benchmark, define, runBenchmark } from './microBenchmark';
import Processor from '../src';

function range(size: number, startAt = 1) {
  return Array.from(Array(size).keys()).map(i => i + startAt);
}

export const benchmarks: Benchmark<any>[] = [
  define({
    name: 'interpret',
    prepare: () => ({
      processor: new Processor(),
      classes: [
        range(100).map(i => `p-${i}`),
        range(100).map(i => `mt-${i}`),
      ].flat().join(' '),
    }),
    fn: ({ processor, classes }) => {
      processor.interpret(classes);
    },
    repeat: 1000,
  }),
];

async function start(){
  for (const bench of benchmarks) {
    const result = await runBenchmark(bench);
    console.log(result);
  }
}

start();
