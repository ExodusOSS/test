/**
 * Type definitions for @exodus/test/jest
 * Re-exports types from @jest/globals where possible
 */

import type { Expect } from './expect.d.ts'

// Re-export Jest types from @jest/globals
export { describe, test, it, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals'

// Re-export jest object
export declare const jest: typeof import('@jest/globals').jest

/** Alias for test() */
export declare function should(name: string, fn: () => void | Promise<void>, timeout?: number): void

export type { Expect } from './expect.d.ts'
export declare const expect: Expect
