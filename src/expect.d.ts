/**
 * Type definitions for @exodus/test/expect
 * Re-exports types from the expect package
 */

export type { Expect } from 'expect'
export declare const expect: import('expect').Expect

/** Load the expect library (for internal use) */
export declare function loadExpect(reason?: string): import('expect').Expect
