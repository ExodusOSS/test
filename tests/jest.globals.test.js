import { describe, test, expect } from '@jest/globals'

describe('example test', () => {
  test('first test', () => {
    expect(1).toBe(1)
    expect(1).not.toBe(2)
  })
})
