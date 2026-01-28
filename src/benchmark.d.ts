/**
 * Type definitions for @exodus/test/benchmark
 * Provides benchmark utilities for performance testing
 */

/// <reference types="node" />

/**
 * Benchmark options
 */
export interface BenchmarkOptions {
  /** Array of arguments to pass to the benchmark function */
  args?: any[];
  
  /** Timeout in milliseconds (default: 1000) */
  timeout?: number;
  
  /** Skip this benchmark */
  skip?: boolean;
}

/**
 * Runs a benchmark
 * @param name - Name of the benchmark
 * @param options - Benchmark options
 * @param fn - Function to benchmark
 */
export function benchmark(
  name: string,
  options: BenchmarkOptions,
  fn: (arg?: any) => any | Promise<any>
): Promise<void>;

export function benchmark(
  name: string,
  fn: (arg?: any) => any | Promise<any>
): Promise<void>;
