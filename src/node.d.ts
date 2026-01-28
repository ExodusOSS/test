/**
 * Type definitions for @exodus/test/node
 * Provides Node.js test runner compatible APIs
 */

/// <reference types="node" />

/**
 * Mock function interface
 */
export interface MockFunctionContext {
  calls: Array<{ arguments: any[]; result?: any; error?: any; target?: any; this?: any }>
  callCount(): number
  mockImplementation(implementation: Function): void
  mockImplementationOnce(implementation: Function, onCall?: number): void
  resetCalls(): void
  restore(): void
}

/**
 * Mock object
 */
export interface Mock {
  /** Creates a mock function */
  fn<T extends Function = Function>(original?: T, options?: any): T & { mock: MockFunctionContext }

  /** Gets the mock context */
  getter<T>(object: any, methodName: string, options?: any): T

  /** Mock method */
  method<T extends Function = Function>(
    object: any,
    methodName: string,
    implementation?: T,
    options?: any
  ): T & { mock: MockFunctionContext }

  /** Mock setter */
  setter(object: any, methodName: string, options?: any): Function

  /** Resets all mocks */
  reset(): void

  /** Restores all mocks */
  restoreAll(): void

  /** Timer mocking */
  timers?: {
    enable(options?: { apis?: string[] }): void
    reset(): void
    tick(milliseconds: number): void
    runAll(): void
  }
}

export declare const mock: Mock

/**
 * Test context passed to test functions
 */
export interface TestContext {
  /** Test name */
  readonly name: string

  /** Full test name including parent describe blocks */
  readonly fullName: string

  /** Diagnostic function */
  diagnostic(message: string): void

  /** Runs a hook */
  runOnly(value: boolean): void

  /** Skips the test */
  skip(message?: string): void

  /** Marks test as todo */
  todo(message?: string): void
}

/**
 * Test function type
 */
export type TestFn = (
  name: string,
  options?: { timeout?: number; skip?: boolean; todo?: boolean; concurrency?: number },
  fn?: (t: TestContext) => void | Promise<void>
) => void

/**
 * Test function with additional properties
 */
export interface Test extends TestFn {
  /** Only run this test */
  only: TestFn

  /** Skip this test */
  skip: TestFn

  /** Mark this test as todo */
  todo: TestFn
}

/**
 * Describe function type
 */
export type DescribeFn = (
  name: string,
  options?: { timeout?: number; skip?: boolean; todo?: boolean; concurrency?: number },
  fn?: () => void
) => void

/**
 * Describe function with additional properties
 */
export interface Describe extends DescribeFn {
  /** Only run this suite */
  only: DescribeFn

  /** Skip this suite */
  skip: DescribeFn

  /** Mark this suite as todo */
  todo: DescribeFn
}

export declare const describe: Describe
export declare const test: Test
export declare const it: Test

/** Lifecycle hooks */
export declare function beforeEach(
  fn: (t: TestContext) => void | Promise<void>,
  options?: { timeout?: number }
): void
export declare function afterEach(
  fn: (t: TestContext) => void | Promise<void>,
  options?: { timeout?: number }
): void
export declare function before(
  fn: (t: TestContext) => void | Promise<void>,
  options?: { timeout?: number }
): void
export declare function after(
  fn: (t: TestContext) => void | Promise<void>,
  options?: { timeout?: number }
): void

/**
 * Snapshot utilities
 */
export declare const snapshot: {
  /** Sets default snapshot serializers */
  setDefaultSnapshotSerializers(serializers: any[]): void

  /** Sets the snapshot path resolver (not supported) */
  setResolveSnapshotPath(): never
}
