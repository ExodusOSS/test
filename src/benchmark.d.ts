/**
 * Benchmark utilities for performance testing
 *
 * ```js
 * import { benchmark } from '@exodus/test/benchmark'
 * ```
 *
 * Can be used with or without `@exodus/test` test runner.
 * @module @exodus/test/benchmark
 */

/**
 * Benchmark options
 * @inline
 */
export interface BenchmarkOptions {
  /** Array of arguments to pass to the benchmark function */
  args?: any[]
  /** Timeout in milliseconds (default: 1000) */
  timeout?: number
  /** Skip this benchmark */
  skip?: boolean
  /** Number of warmup iterations to run before the benchmark (default: 0) */
  warmup?: number
  /** Print benchmark results to console (default: true) */
  print?: boolean
}

/**
 * Runs a benchmark
 * @param name - Name of the benchmark
 * @param options - Benchmark options
 * @param fn - Function to benchmark
 */
export declare function benchmark<A>(
  name: string,
  options: BenchmarkOptions & { args: A[] },
  fn: (arg: A) => any | Promise<any>
): Promise<void>
export declare function benchmark(
  name: string,
  options: BenchmarkOptions & { args?: undefined },
  fn: (arg: number) => any | Promise<any>
): Promise<void>
