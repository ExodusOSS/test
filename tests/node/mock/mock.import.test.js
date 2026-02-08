import assert from 'node:assert/strict'
import { describe, test, mock } from 'node:test'

/*
Node.js:

require { x: 20, foo: 'mocked foo' }
await import [Module: null prototype] {
  default: { x: 20, foo: 'mocked foo' },
  foo: 'mocked foo',
  'module.exports': { x: 20, foo: 'mocked foo' }
}
*/

describe('mocking a builtin module from esm', { skip: !mock.module }, () => {
  test('should do a mock, import', async () => {
    mock.module('node:fs', {
      defaultExport: { x: 20 },
      namedExports: { foo: 'mocked foo' },
    })

    const fs = await import('node:fs')
    assert.equal(fs.default.x, 20)
    assert.equal(fs.default.foo, 'mocked foo')
    assert.equal(fs.foo, 'mocked foo')
  })
})

describe('mocking a module from esm', { skip: !mock.module }, () => {
  test('should do a mock, import', async () => {
    mock.module('c8', {
      defaultExport: { x: 20 },
      namedExports: { foo: 'mocked foo' },
    })

    const fs = await import('c8') // eslint-disable-line @exodus/import/no-extraneous-dependencies
    assert.equal(fs.default.x, 20)
    assert.equal(fs.default.foo, 'mocked foo')
    assert.equal(fs.foo, 'mocked foo')
  })
})
