/**
 * Type definitions for @exodus/test/node
 * Re-exports types from @types/node where possible
 */

/// <reference types="node" />

// Re-export from node:test module
export {
  mock,
  describe,
  test,
  it,
  beforeEach,
  afterEach,
  before,
  after,
} from 'node:test'

/**
 * Snapshot utilities
 */
export declare const snapshot: {
  /** Sets default snapshot serializers */
  setDefaultSnapshotSerializers(serializers: any[]): void

  /** Sets the snapshot path resolver (not supported) */
  setResolveSnapshotPath(): never
}
