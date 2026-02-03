/**
 * [Jest Expect](https://jestjs.io/docs/expect)-compatible API, but much faster
 *
 * If you are using Jest globals, you don't have to import this manually.
 *
 * Just run `@exodus/test` with `--jest` flag and use global `expect`.
 *
 * See [Jest Expect documentation](https://jestjs.io/docs/expect).
 *
 * If you want to import it directly:
 * ```js
 * import { expect } from '@exodus/test/expect'
 * ```
 *
 * This short-cuts most common cases and tries to avoid loading `expect` altogether,
 * but for everything that can't be bypassed (e.g. test failures) it uses real `expect`.
 *
 * Everything including output formatting matches Jest `expect`.
 * @module @exodus/test/expect
 */

export type { Expect } from 'expect'
export declare const expect: import('expect').Expect

/**
 * Load the expect library (for internal use)
 * @internal
 */
export declare function loadExpect(reason?: string): import('expect').Expect
