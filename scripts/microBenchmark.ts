export interface BenchmarkResult {
  name: string
  total: number
  average: number
  repeat: number
}

export interface Benchmark<T = undefined> {
  name: string
  fn: (arg: T) => void
  prepare?: () => T | Promise<T>
  repeat?: number
}

export function runMicrobenchmark(name: string, fn: () => void, repeat = 100): BenchmarkResult {
  // Run before starting the clock to warm up the JIT, caches, etc.
  for (let i = 0; i < 10; i++) {
    fn();
  }
  const start = Date.now();
  for (let i = 0; i < repeat; i++) {
    fn();
  }
  const end = Date.now();
  const total = end - start;
  const average = total / repeat;

  return {
    name,
    repeat,
    total,
    average,
  };
}

export function define<T>(bench: Benchmark<T>): Benchmark<T> {
  return bench;
}

export async function runBenchmark<T>(bench: Benchmark<T>): Promise<BenchmarkResult> {
  const arg = await bench.prepare();
  return runMicrobenchmark(bench.name, () => bench.fn(arg), bench.repeat);
}
