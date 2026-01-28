/**
 * Type definitions for @exodus/test/expect
 * Provides expect() assertion library compatible with Jest
 */

/// <reference types="node" />

/**
 * Asymmetric matcher interface
 */
export interface AsymmetricMatcher {
  asymmetricMatch(other: unknown): boolean;
  toString(): string;
  getExpectedType?(): string;
  toAsymmetricMatcher?(): string;
}

/**
 * Asymmetric matchers for flexible matching
 */
export interface AsymmetricMatchers {
  /** Matches any value of the given type */
  any(classType: any): AsymmetricMatcher;
  
  /** Matches anything (not null or undefined) */
  anything(): AsymmetricMatcher;
  
  /** Matches an array containing the given elements */
  arrayContaining<E = any>(arr: E[]): AsymmetricMatcher;
  
  /** Matches an object containing the given properties */
  objectContaining<E = any>(obj: E): AsymmetricMatcher;
  
  /** Matches a string containing the substring */
  stringContaining(str: string): AsymmetricMatcher;
  
  /** Matches a string matching the pattern */
  stringMatching(pattern: string | RegExp): AsymmetricMatcher;
  
  /** Matches a number close to the expected value */
  closeTo(num: number, numDigits?: number): AsymmetricMatcher;
}

/**
 * Inverse matchers (accessible via .not)
 */
export type InverseMatchers<T> = {
  readonly [K in keyof T]: T[K];
};

/**
 * Core matchers available on expect()
 */
export interface Matchers<R = void, T = unknown> {
  /** Checks if two values are the same (using Object.is) */
  toBe(expected: any): R;
  
  /** Checks if value is null */
  toBeNull(): R;
  
  /** Checks if value is truthy */
  toBeTruthy(): R;
  
  /** Checks if value is falsy */
  toBeFalsy(): R;
  
  /** Checks if value is true */
  toBeTrue(): R;
  
  /** Checks if value is false */
  toBeFalse(): R;
  
  /** Checks if value is defined */
  toBeDefined(): R;
  
  /** Checks if value is undefined */
  toBeUndefined(): R;
  
  /** Checks if value is an instance of a class */
  toBeInstanceOf(expected: any): R;
  
  /** Checks if value is a string */
  toBeString(): R;
  
  /** Checks if value is a number */
  toBeNumber(): R;
  
  /** Checks if value is an array */
  toBeArray(): R;
  
  /** Checks if value is NaN */
  toBeNaN(): R;
  
  /** Checks if value is greater than expected */
  toBeGreaterThan(expected: number | bigint): R;
  
  /** Checks if value is greater than or equal to expected */
  toBeGreaterThanOrEqual(expected: number | bigint): R;
  
  /** Checks if value is less than expected */
  toBeLessThan(expected: number | bigint): R;
  
  /** Checks if value is less than or equal to expected */
  toBeLessThanOrEqual(expected: number | bigint): R;
  
  /** Checks if value is close to expected (for floating point) */
  toBeCloseTo(expected: number, numDigits?: number): R;
  
  /** Checks deep equality */
  toEqual(expected: any): R;
  
  /** Checks strict deep equality */
  toStrictEqual(expected: any): R;
  
  /** Checks if array/string contains value */
  toContain(expected: any): R;
  
  /** Checks if array contains object with equal properties */
  toContainEqual(expected: any): R;
  
  /** Checks if object has the given property */
  toHaveProperty(keyPath: string | string[], value?: any): R;
  
  /** Checks if array/string has the given length */
  toHaveLength(expected: number): R;
  
  /** Checks if string matches pattern */
  toMatch(expected: string | RegExp): R;
  
  /** Checks if object matches subset */
  toMatchObject(expected: Record<string, any> | Record<string, any>[]): R;
  
  /** Checks if function throws */
  toThrow(expected?: string | RegExp | Error): R;
  
  /** Checks if function throws an error matching snapshot */
  toThrowErrorMatchingSnapshot(hint?: string): R;
  
  /** Checks if function throws an error matching inline snapshot */
  toThrowErrorMatchingInlineSnapshot(snapshot?: string): R;
  
  /** Checks if value matches snapshot */
  toMatchSnapshot(propertyMatchers?: any, hint?: string): R;
  
  /** Checks if value matches inline snapshot */
  toMatchInlineSnapshot(propertyMatchers?: any, snapshot?: string): R;
  
  /** Mock function matchers */
  
  /** Checks if mock was called */
  toHaveBeenCalled(): R;
  
  /** Alias for toHaveBeenCalled */
  toBeCalled(): R;
  
  /** Checks if mock was called specific number of times */
  toHaveBeenCalledTimes(expected: number): R;
  
  /** Alias for toHaveBeenCalledTimes */
  toBeCalledTimes(expected: number): R;
  
  /** Checks if mock was called with specific arguments */
  toHaveBeenCalledWith(...expected: any[]): R;
  
  /** Alias for toHaveBeenCalledWith */
  toBeCalledWith(...expected: any[]): R;
  
  /** Checks if mock was last called with specific arguments */
  toHaveBeenLastCalledWith(...expected: any[]): R;
  
  /** Alias for toHaveBeenLastCalledWith */
  lastCalledWith(...expected: any[]): R;
  
  /** Checks if mock was nth called with specific arguments */
  toHaveBeenNthCalledWith(nthCall: number, ...expected: any[]): R;
  
  /** Alias for toHaveBeenNthCalledWith */
  nthCalledWith(nthCall: number, ...expected: any[]): R;
  
  /** Checks if mock returned */
  toHaveReturned(): R;
  
  /** Alias for toHaveReturned */
  toReturn(): R;
  
  /** Checks if mock returned specific number of times */
  toHaveReturnedTimes(expected: number): R;
  
  /** Alias for toHaveReturnedTimes */
  toReturnTimes(expected: number): R;
  
  /** Checks if mock returned specific value */
  toHaveReturnedWith(expected: any): R;
  
  /** Alias for toHaveReturnedWith */
  toReturnWith(expected: any): R;
  
  /** Checks if mock last returned specific value */
  toHaveLastReturnedWith(expected: any): R;
  
  /** Alias for toHaveLastReturnedWith */
  lastReturnedWith(expected: any): R;
  
  /** Checks if mock nth returned specific value */
  toHaveNthReturnedWith(nthCall: number, expected: any): R;
  
  /** Alias for toHaveNthReturnedWith */
  nthReturnedWith(nthCall: number, expected: any): R;
  
  /** Inverse matchers */
  not: InverseMatchers<Omit<Matchers<R, T>, 'not' | 'resolves' | 'rejects'>>;
  
  /** Promise matchers */
  resolves: Matchers<Promise<R>, T>;
  rejects: Matchers<Promise<R>, T>;
}

/**
 * Base expect interface
 */
export interface BaseExpect {
  /** Sets the number of assertions expected in the test */
  assertions(count: number): void;
  
  /** Asserts that at least one assertion was called */
  hasAssertions(): void;
  
  /** Extends expect with custom matchers */
  extend(matchers: Record<string, (this: any, ...args: any[]) => any>): void;
  
  /** Adds custom equality testers */
  addEqualityTesters(testers: any[]): void;
  
  /** Gets the current matcher state */
  getState(): any;
  
  /** Sets the matcher state */
  setState(state: Partial<any>): void;
  
  /** Extracts expected assertion errors */
  extractExpectedAssertionsErrors(): Array<{ actual: string | number; error: Error; expected: string }>;
}

/**
 * Main expect type
 */
export type Expect = (<T = any>(actual: T) => Matchers<void, T>) & 
  BaseExpect & 
  AsymmetricMatchers & {
    not: Omit<AsymmetricMatchers, 'any' | 'anything'>;
  };

export const expect: Expect;

/** Load the expect library (for internal use) */
export function loadExpect(reason?: string): Expect;
