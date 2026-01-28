/**
 * Type definitions for @exodus/test/jest
 * Provides Jest-compatible testing APIs
 */

/// <reference types="node" />

import type { Expect } from './expect.cjs';

/**
 * Mock function interface with Jest-compatible API
 */
export interface MockInstance<T = any, Y extends any[] = any[]> {
  _isMockFunction: true;
  mock: {
    calls: Y[];
    results: Array<{ type: 'return' | 'throw'; value: any }>;
    instances: any[];
    contexts: any[];
    lastCall?: Y;
    invocationCallOrder: number[];
  };
  
  /** Clears all information stored in the mock */
  mockClear(): this;
  
  /** Resets all information and implementation stored in the mock */
  mockReset(): this;
  
  /** Removes the mock and restores the initial implementation */
  mockRestore(): void;
  
  /** Sets the implementation of the mock */
  mockImplementation(fn?: (...args: Y) => T): this;
  
  /** Sets the implementation once for the next call */
  mockImplementationOnce(fn: (...args: Y) => T): this;
  
  /** Sets the name of the mock for better error messages */
  mockName(name: string): this;
  
  /** Sets the return value of the mock */
  mockReturnValue(value: T): this;
  
  /** Sets the return value once for the next call */
  mockReturnValueOnce(value: T): this;
  
  /** Makes the mock resolve to the given value */
  mockResolvedValue(value: T extends Promise<infer U> ? U : never): this;
  
  /** Makes the mock resolve to the given value once */
  mockResolvedValueOnce(value: T extends Promise<infer U> ? U : never): this;
  
  /** Makes the mock reject with the given error */
  mockRejectedValue(value: any): this;
  
  /** Makes the mock reject with the given error once */
  mockRejectedValueOnce(value: any): this;
  
  /** Gets the current implementation */
  getMockImplementation(): ((...args: Y) => T) | undefined;
  
  /** Gets the name of the mock */
  getMockName(): string;
}

/**
 * Timer control APIs
 */
export interface TimerAPIs {
  /** Advances all timers by the specified number of milliseconds */
  advanceTimersByTime(msToRun: number): typeof jest;
  
  /** Advances timers to the next timer */
  advanceTimersToNextTimer(steps?: number): typeof jest;
  
  /** Clears all timers */
  clearAllTimers(): typeof jest;
  
  /** Gets the number of fake timers still waiting */
  getTimerCount(): number;
  
  /** Runs all pending timers */
  runAllTimers(): typeof jest;
  
  /** Runs only currently pending timers */
  runOnlyPendingTimers(): typeof jest;
  
  /** Enables fake timers */
  useFakeTimers(config?: { doNotFake?: string[] }): typeof jest;
  
  /** Disables fake timers and restores real timers */
  useRealTimers(): typeof jest;
  
  /** Sets system time */
  setSystemTime(now?: number | Date): typeof jest;
  
  /** Gets real system time */
  getRealSystemTime(): number;
}

/**
 * Module mocking APIs
 */
export interface ModuleMockAPIs {
  /** Mocks a module */
  mock(moduleName: string, factory?: () => any, options?: { virtual?: boolean }): typeof jest;
  
  /** Mocks a module without hoisting */
  doMock(moduleName: string, factory?: () => any, options?: { virtual?: boolean }): typeof jest;
  
  /** Sets a mock for a module */
  setMock(moduleName: string, moduleExports: any): typeof jest;
  
  /** Unmocks a module */
  unmock(moduleName: string): typeof jest;
  
  /** Alias for unmock */
  dontMock(moduleName: string): typeof jest;
  
  /** Creates a mock from a module */
  createMockFromModule<T = unknown>(moduleName: string): T;
  
  /** Requires a mocked module */
  requireMock<T = any>(moduleName: string): T;
  
  /** Requires the actual module, bypassing mocks */
  requireActual<T = any>(moduleName: string): T;
  
  /** Resets the module registry */
  resetModules(): typeof jest;
}

/**
 * Exodus-specific extensions
 */
export interface ExodusAPIs {
  mock: {
    fetchReplay: (url: string) => void;
    websocketRecord: () => void;
    fetchRecord: () => void;
    websocketReplay: () => void;
    timersSpeedup: (rate: number, options?: { apis?: string[] }) => void;
    timersTrack: () => void;
    timersDebug: () => void;
    timersList: () => void;
    timersAssert: () => void;
    fetchNoop: () => MockInstance;
    websocketNoop: () => MockInstance;
  };
}

/**
 * Jest global object
 */
export interface Jest extends TimerAPIs, ModuleMockAPIs {
  /** Creates a mock function */
  fn<T = any, Y extends any[] = any[]>(implementation?: (...args: Y) => T): MockInstance<T, Y>;
  
  /** Checks if a function is a mock */
  isMockFunction(fn: any): fn is MockInstance;
  
  /** Spies on an object method */
  spyOn<T extends {}, M extends keyof T>(
    object: T,
    method: M,
    accessType?: 'get' | 'set'
  ): T[M] extends (...args: any[]) => any ? MockInstance<ReturnType<T[M]>, Parameters<T[M]>> : MockInstance;
  
  /** Clears all mocks */
  clearAllMocks(): typeof jest;
  
  /** Resets all mocks */
  resetAllMocks(): typeof jest;
  
  /** Restores all mocks */
  restoreAllMocks(): typeof jest;
  
  /** Sets the timeout for the current test */
  setTimeout(timeout: number): typeof jest;
  
  /** Exodus-specific extensions */
  exodus?: ExodusAPIs;
}

export const jest: Jest;

/**
 * Test function with Jest API
 */
export interface TestFn {
  /** Defines a test */
  (name: string, fn: () => void | Promise<void>, timeout?: number): void;
  
  /** Only runs this test */
  only: TestFn;
  
  /** Skips this test */
  skip: TestFn;
  
  /** Marks this test as todo */
  todo: TestFn;
  
  /** Runs test concurrently */
  concurrent: TestFn & {
    only: TestFn;
    skip: TestFn;
    each: <T>(cases: T[][] | T[]) => (name: string, fn: (...args: T[]) => void | Promise<void>, timeout?: number) => void;
  };
  
  /** Parameterized tests */
  each: <T>(cases: T[][] | T[]) => (name: string, fn: (...args: T[]) => void | Promise<void>, timeout?: number) => void;
}

/**
 * Describe function for grouping tests
 */
export interface DescribeFn {
  /** Defines a test suite */
  (name: string, fn: () => void): void;
  
  /** Only runs this suite */
  only: DescribeFn;
  
  /** Skips this suite */
  skip: DescribeFn;
  
  /** Parameterized test suites */
  each: <T>(cases: T[][] | T[]) => (name: string, fn: (...args: T[]) => void) => void;
}

export const describe: DescribeFn;
export const test: TestFn;
export const it: TestFn;

/** Lifecycle hooks */
export function beforeEach(fn: (() => void | Promise<void>)): void;
export function afterEach(fn: (() => void | Promise<void>)): void;
export function beforeAll(fn: (() => void | Promise<void>)): void;
export function afterAll(fn: (() => void | Promise<void>)): void;

/** Alias for test() */
export function should(name: string, fn: () => void | Promise<void>, timeout?: number): void;

export { Expect as expect } from './expect.cjs';
