/**
 * [Jest](https://jestjs.io/)-compatible API, but much faster, ESM friendly, and based on `node:test`
 *
 * You likely don't have to import this manually.
 *
 * Just run `@exodus/test` with `--jest` flag.
 *
 * See [Jest API documentation](https://jestjs.io/docs/api).
 *
 * If you want to run Jest test files with just `node` (or without `--jest` flag), do e.g.:
 * ```js
 * import { describe, test, expect, jest } from '@exodus/test/jest'
 * import { beforeEach, afterEach, beforeAll, afterAll } from '@exodus/test/jest'
 * ```
 * @module @exodus/test/jest
 */

// Re-export Jest types from @jest/globals
export { describe, test, it, jest, beforeEach, afterEach, beforeAll, afterAll } from '@jest/globals'
export type { expect, Expect } from './expect.d.ts'

/**
 * Alias for test()
 *
 * For using the resolution as a drop-in replacement for libs expecting `should()`
 * @hidden
 */
export declare function should(name: string, fn: () => void | Promise<void>, timeout?: number): void
