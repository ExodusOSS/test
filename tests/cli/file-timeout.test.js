import { describe, test } from 'node:test'
import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const bin = fileURLToPath(import.meta.resolve('../../bin/index.js'))
const dir = 'tests/integration/file-timeout'
const env = Object.fromEntries(
  Object.entries(process.env).filter(
    ([k]) => !k.startsWith('EXODUS_TEST_') && k !== 'NODE_TEST_CONTEXT'
  )
)

const run = (...args) => {
  const res = spawnSync('node', [bin, '--no-colors', ...args], { env, encoding: 'utf8' })
  return { code: res.status, out: `${res.stdout}${res.stderr}` }
}

const failedSuites = (out) => {
  const [, list = ''] = out.split('Failed test suites:\n')
  return list
    .split('\n')
    .filter((x) => x.startsWith('  '))
    .map((x) => x.trim())
}

describe('--file-timeout', { timeout: 60_000 }, () => {
  test('kills hanging files on node:test and keeps running the rest', () => {
    const files = ['blocking', 'toplevel-await', 'passing', '1-slow.inband', '2-slow.inband']
    const args = ['--jest', '--testTimeout', '900', '--file-timeout', '1000']
    const { code, out } = run(...args, ...files.map((f) => `${dir}/${f}.js`))
    assert.equal(code, 1)
    assert.deepEqual(failedSuites(out), [`${dir}/blocking.js`, `${dir}/toplevel-await.js`])
    for (const file of ['blocking', 'toplevel-await']) {
      assert.ok(out.includes(`File timeout of 1000ms reached, killing ${dir}/${file}.js`), out)
    }

    assert.match(out, /PASS passes/)
  })

  test('overrides the deadline on pure engines', () => {
    const args = ['--engine', 'node:pure', '--testTimeout', '100', '--file-timeout', '1000']
    const { code, out } = run(...args, `${dir}/blocking.js`)
    assert.equal(code, 1)
    assert.match(out, /File timeout of 1000ms reached/)
    assert.deepEqual(failedSuites(out), [`${dir}/blocking.js`])
  })

  for (const value of ['0', '-1', '1.5', 'abc', '100']) {
    test(`rejects ${value}`, () => {
      const args = ['--testTimeout', '100', '--file-timeout', value]
      const { code, out } = run(...args, `${dir}/passing.js`)
      assert.equal(code, 1)
      assert.match(out, /--file-timeout should be an integer greater than testTimeout \(100ms\)/)
    })
  }

  test('rejects deno:test', () => {
    const args = ['--engine', 'deno:test', '--file-timeout', '6000']
    const { code, out } = run(...args, `${dir}/passing.js`)
    assert.equal(code, 1)
    assert.match(out, /deno:test engine does not support --file-timeout/)
  })
})
