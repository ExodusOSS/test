/**
 * [node:test](https://nodejs.org/api/test.html)-compatible API
 *
 * You most likely don't have to import this manually, just use `node:test`.
 *
 * Example:
 * ```js
 * import { test, describe } from 'node:test'
 * ```
 *
 * This import is what `@exodus/test` will resolve that to on non-Node.js engines,
 * e.g. browsers and barebones.
 *
 * See [node:test documentation](https://nodejs.org/api/test.html).
 * @module @exodus/test/node
 */

/// <reference types="node" />

// Re-export from node:test module
export { describe, test, it, beforeEach, afterEach, before, after, mock, snapshot } from 'node:test'
