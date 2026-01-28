/**
 * Type definitions for @exodus/test/jest
 * Re-exports types from @types/jest where possible
 */

/// <reference types="jest" />

import type { Expect } from './expect.d.ts'

// Re-export Jest types from @types/jest
export declare const jest: typeof globalThis.jest
export declare const describe: typeof globalThis.describe
export declare const test: typeof globalThis.test
export declare const it: typeof globalThis.it

/** Lifecycle hooks */
export declare const beforeEach: typeof globalThis.beforeEach
export declare const afterEach: typeof globalThis.afterEach
export declare const beforeAll: typeof globalThis.beforeAll
export declare const afterAll: typeof globalThis.afterAll

/** Alias for test() */
export declare function should(name: string, fn: () => void | Promise<void>, timeout?: number): void

export type { Expect } from './expect.d.ts'
export declare const expect: Expect
