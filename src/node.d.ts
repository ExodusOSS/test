/**
 * Type definitions for @exodus/test/node
 * Re-exports types from @types/node where possible
 */

/// <reference types="node" />

// Re-export from node:test module
export { describe, test, it, beforeEach, afterEach, before, after, mock, snapshot } from 'node:test'
