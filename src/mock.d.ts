/**
 * Type definitions for @exodus/test/mock
 * Provides mocking and testing utilities
 */

/// <reference types="node" />

/**
 * Network replay utilities
 */

/** Records fetch calls and returns a fetch function */
export declare function fetchRecord(options?: any): typeof fetch

/** Replays fetch calls from recording and returns a fetch function */
export declare function fetchReplay(): typeof fetch

/** Records WebSocket calls and returns a WebSocket constructor */
export declare function websocketRecord(options?: any): typeof WebSocket

/** Replays WebSocket calls from recording and returns a WebSocket constructor */
export declare function websocketReplay(options?: any): typeof WebSocket

/**
 * Timer tracking and debugging utilities
 */

/** Enables timer tracking */
export declare function timersTrack(): void

/** Outputs debug information about active timers */
export declare function timersDebug(): void

/** Lists all active timers */
export declare function timersList(): any[]

/** Asserts no timers are active */
export declare function timersAssert(): void

/**
 * Speeds up timers by the given rate
 * @param rate - Speed multiplier (e.g., 2 means 2x faster)
 * @param options - Configuration options
 * @param options.apis - Array of APIs to speed up (default: ['setTimeout', 'setInterval', 'Date'])
 */
export declare function timersSpeedup(
  rate: number,
  options?: { apis?: ('setTimeout' | 'setInterval' | 'Date')[] }
): void
