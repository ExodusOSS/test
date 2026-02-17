import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { benchmark } from '../src/benchmark.js'

test('benchmark with warmup option', async () => {
  let callCount = 0
  const fn = () => {
    callCount++
  }

  // Capture console.log output
  const originalLog = console.log
  let logged = ''
  console.log = (msg) => {
    logged += msg + '\n'
  }

  try {
    await benchmark('test warmup', { warmup: 5, timeout: 10 }, fn)
    
    // At least 5 warmup calls should have been made plus some benchmark calls
    assert(callCount > 5, `Expected callCount > 5, got ${callCount}`)
    
    // Check that benchmark output was logged
    assert(logged.includes('test warmup'), 'Expected benchmark output')
  } finally {
    console.log = originalLog
  }
})

test('benchmark without warmup option', async () => {
  let callCount = 0
  const fn = () => {
    callCount++
  }

  // Capture console.log output
  const originalLog = console.log
  console.log = () => {} // Suppress output

  try {
    await benchmark('test no warmup', { timeout: 10 }, fn)
    
    // Only benchmark calls should have been made (no warmup)
    assert(callCount > 0, `Expected callCount > 0, got ${callCount}`)
  } finally {
    console.log = originalLog
  }
})

test('benchmark warmup with args', async () => {
  const callArgs = []
  const fn = (arg) => {
    callArgs.push(arg)
  }

  // Capture console.log output
  const originalLog = console.log
  console.log = () => {} // Suppress output

  try {
    const args = ['a', 'b', 'c']
    await benchmark('test warmup with args', { args, warmup: 7, timeout: 10 }, fn)
    
    // Check that warmup used the args in the correct order (cycling through)
    // First 7 calls are warmup: a, b, c, a, b, c, a
    assert.strictEqual(callArgs[0], 'a')
    assert.strictEqual(callArgs[1], 'b')
    assert.strictEqual(callArgs[2], 'c')
    assert.strictEqual(callArgs[3], 'a')
    assert.strictEqual(callArgs[4], 'b')
    assert.strictEqual(callArgs[5], 'c')
    assert.strictEqual(callArgs[6], 'a')
  } finally {
    console.log = originalLog
  }
})

test('benchmark warmup with async function', async () => {
  let callCount = 0
  const fn = async () => {
    callCount++
    await new Promise((resolve) => setTimeout(resolve, 1))
  }

  // Capture console.log output
  const originalLog = console.log
  console.log = () => {} // Suppress output

  try {
    await benchmark('test async warmup', { warmup: 3, timeout: 10 }, fn)
    
    // At least 3 warmup calls should have been made plus some benchmark calls
    assert(callCount > 3, `Expected callCount > 3, got ${callCount}`)
  } finally {
    console.log = originalLog
  }
})

test('benchmark warmup with zero value', async () => {
  let callCount = 0
  const fn = () => {
    callCount++
  }

  // Capture console.log output
  const originalLog = console.log
  console.log = () => {} // Suppress output

  try {
    await benchmark('test zero warmup', { warmup: 0, timeout: 10 }, fn)
    
    // Only benchmark calls should have been made (no warmup)
    assert(callCount > 0, `Expected callCount > 0, got ${callCount}`)
  } finally {
    console.log = originalLog
  }
})
