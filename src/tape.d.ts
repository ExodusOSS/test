/**
 * Type definitions for @exodus/test/tape
 * Provides tape-compatible testing APIs
 */

/// <reference types="node" />

/**
 * Tape test context/assertion object
 */
export interface Test {
  /** Plans the number of assertions */
  plan(count: number): void

  /** Ends the test */
  end(): void

  /** Skips the test */
  skip(msg?: string): void

  /** Marks test as todo */
  todo(msg?: string): void

  /** Adds a comment */
  comment(msg: string): void

  /** Nested test */
  test(name: string, cb: (t: Test) => void): void
  test(name: string, opts: TestOptions, cb: (t: Test) => void): void

  /** Assertions */

  /** Assert that value is truthy */
  ok(value: any, msg?: string): void
  true(value: any, msg?: string): void
  assert(value: any, msg?: string): void

  /** Assert that value is falsy */
  notOk(value: any, msg?: string): void
  false(value: any, msg?: string): void
  notok(value: any, msg?: string): void

  /** Assert strict equality */
  equal(actual: any, expected: any, msg?: string): void
  equals(actual: any, expected: any, msg?: string): void
  isEqual(actual: any, expected: any, msg?: string): void
  is(actual: any, expected: any, msg?: string): void
  strictEqual(actual: any, expected: any, msg?: string): void
  strictEquals(actual: any, expected: any, msg?: string): void

  /** Assert strict inequality */
  notEqual(actual: any, expected: any, msg?: string): void
  notEquals(actual: any, expected: any, msg?: string): void
  notStrictEqual(actual: any, expected: any, msg?: string): void
  notStrictEquals(actual: any, expected: any, msg?: string): void
  doesNotEqual(actual: any, expected: any, msg?: string): void
  isNotEqual(actual: any, expected: any, msg?: string): void
  isNot(actual: any, expected: any, msg?: string): void
  not(actual: any, expected: any, msg?: string): void
  isInequal(actual: any, expected: any, msg?: string): void

  /** Assert loose equality */
  looseEqual(actual: any, expected: any, msg?: string): void
  looseEquals(actual: any, expected: any, msg?: string): void

  /** Assert loose inequality */
  notLooseEqual(actual: any, expected: any, msg?: string): void
  notLooseEquals(actual: any, expected: any, msg?: string): void

  /** Assert deep strict equality */
  deepEqual(actual: any, expected: any, msg?: string): void
  deepEquals(actual: any, expected: any, msg?: string): void
  isEquivalent(actual: any, expected: any, msg?: string): void
  same(actual: any, expected: any, msg?: string): void

  /** Assert deep strict inequality */
  notDeepEqual(actual: any, expected: any, msg?: string): void
  notDeepEquals(actual: any, expected: any, msg?: string): void
  notEquivalent(actual: any, expected: any, msg?: string): void
  notDeeply(actual: any, expected: any, msg?: string): void
  notSame(actual: any, expected: any, msg?: string): void
  isNotDeepEqual(actual: any, expected: any, msg?: string): void
  isNotDeeply(actual: any, expected: any, msg?: string): void
  isNotEquivalent(actual: any, expected: any, msg?: string): void
  isInequivalent(actual: any, expected: any, msg?: string): void

  /** Assert deep loose equality */
  deepLooseEqual(actual: any, expected: any, msg?: string): void

  /** Assert deep loose inequality */
  notDeepLooseEqual(actual: any, expected: any, msg?: string): void

  /** Assert function throws */
  throws(fn: () => any, expected?: RegExp | Function, msg?: string): void

  /** Assert function does not throw */
  doesNotThrow(fn: () => any, expected?: RegExp | Function, msg?: string): void

  /** Assert promise rejects */
  rejects(promise: Promise<any>, expected?: RegExp | Function, msg?: string): Promise<void>

  /** Assert promise resolves */
  resolves(promise: Promise<any>, msg?: string): Promise<void>
  doesNotReject(promise: Promise<any>, expected?: RegExp | Function, msg?: string): Promise<void>

  /** Force a passing assertion */
  pass(msg?: string): void

  /** Force a failing assertion */
  fail(msg?: string): void

  /** Assert no error */
  error(err: any, msg?: string): void
  ifError(err: any, msg?: string): void
  ifErr(err: any, msg?: string): void
  iferror(err: any, msg?: string): void

  /** Custom assertion function */
  assertion(fn: Function, ...args: any[]): void
}

/**
 * Test options
 */
export interface TestOptions {
  skip?: boolean
  todo?: boolean
  timeout?: number
  concurrency?: number
}

/**
 * Test function
 */
export interface TestFunction {
  /** Run a test */
  (name: string, cb: (t: Test) => void): void
  (name: string, opts: TestOptions, cb: (t: Test) => void): void
  (cb: (t: Test) => void): void
  (opts: TestOptions, cb: (t: Test) => void): void

  /** Only run this test */
  only: TestFunction

  /** Skip this test */
  skip: TestFunction

  /** Register a callback to run after all tests finish */
  onFinish(fn: () => void): void
}

declare const test: TestFunction

export { test }

export default test
