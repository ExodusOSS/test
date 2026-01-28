/**
 * Type definitions for @exodus/test/mock
 * Provides mocking and testing utilities
 */

/// <reference types="node" />

/**
 * Network replay utilities
 */
export declare function fetchReplay(url: string, options?: any): Promise<Response>
export declare function websocketRecord(): void
export declare function fetchRecord(): void
export declare function websocketReplay(): void

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
