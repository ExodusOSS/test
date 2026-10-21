import { describe, test } from 'node:test'
import assert from 'node:assert/strict'

describe(
  'quickjs-wasi',
  {
    skip: process.env.EXODUS_TEST_ENGINE !== 'quickjs-wasi:bundle',
  },
  () => {
    test('Are we QuickJS', () => {
      assert.equal(process.env.EXODUS_TEST_PLATFORM, 'quickjs')
      assert.equal(typeof globalThis.gc, 'function')
      assert.equal(globalThis.gc(), undefined)
    })

    test('setTimeout passes arguments', async () => {
      const args = await new Promise((resolve) => setTimeout((...a) => resolve(a), 0, 1, 'x'))
      assert.deepEqual(args, [1, 'x'])
    })

    test('clearTimeout and clearInterval', async () => {
      let count = 0
      const cleared = setTimeout(() => count++, 0)
      clearTimeout(cleared)
      clearTimeout(cleared)
      clearTimeout()
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (++count < 3) return
          clearInterval(interval) // from inside the callback
          setTimeout(resolve, 20)
        }, 1)
      })
      assert.equal(count, 3)
    })

    test('Deep recursion is a catchable RangeError', () => {
      const depth = (n) => (n === 0 ? 0 : 1 + depth(n - 1))
      assert.throws(() => depth(1e6), RangeError)
      assert.equal(depth(1000), 1000)
    })
  }
)
