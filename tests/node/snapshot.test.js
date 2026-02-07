import { describe, it } from 'node:test'
import * as nodeTest from 'node:test'

const skip = !nodeTest.snapshot // Node.js 20.x and 22.12 (22.13 has it)
const wrongSerialization = process.env.EXODUS_TEST_PLATFORM === 'xs' // https://github.com/Moddable-OpenSource/moddable/issues/1564

it('simple', { skip: skip || wrongSerialization }, (t) => {
  t.assert.snapshot(10)
  t.assert.snapshot(null)
  t.assert.snapshot()
  t.assert.snapshot([])
  t.assert.snapshot(/xx/)
  t.assert.snapshot(Infinity)
  t.assert.snapshot(false)
  t.assert.snapshot(true)
  t.assert.snapshot({})
})

it('complex', { skip: skip || wrongSerialization }, (t) => {
  t.assert.snapshot([10])
  t.assert.snapshot([{ a: 10 }])
  t.assert.snapshot({ a: 10 })
  t.assert.snapshot({ a: 10, b: 20 })
  t.assert.snapshot(Buffer.from(''))
})

// repeat test name
it('simple', { skip: skip || wrongSerialization }, (t) => {
  t.assert.snapshot(/hello/)
  t.assert.snapshot(true)
  t.assert.snapshot(NaN)
  t.assert.snapshot({})
  t.assert.snapshot(42)
  t.assert.snapshot([])
  t.assert.snapshot(-Infinity)
})

it('mixed', { skip: skip || wrongSerialization }, (t) => {
  t.assert.snapshot(true)
  t.assert.snapshot([1, 2, 3])
  t.assert.snapshot({ foo: 'bar' })
  t.assert.snapshot(43)
  t.assert.snapshot({})
  t.assert.snapshot([])
})

// repeat test name
it('mixed', { skip: skip || wrongSerialization }, (t) => {
  t.assert.snapshot([5, 4, 3])
  t.assert.snapshot([])
  t.assert.snapshot(false)
  t.assert.snapshot(41)
  t.assert.snapshot({ bar: 'buz' })
  t.assert.snapshot({})
})

it('escape', { skip }, (t) => {
  t.assert.snapshot('\\')
  t.assert.snapshot('${')
  t.assert.snapshot('$$\\${')
})

const TEST_ONE = { a: 20, d: Buffer.from('foo'), b: [1, 2, 'bar', 5], e: { foo: 'bar' } }
// eslint-disable-next-line no-sparse-arrays
const TEST_TWO = { ['__proto__']: [], b: [1, 2, , , 5], e: { foo: 'bar' }, f: -Infinity }
const TEST_THREE = [new Error('?!'), new TypeError('bar'), new Uint16Array([4, 2, 65_123]), null]

// Test names repeat on a purpose!

it('test A', { skip }, (t) => {
  t.assert.snapshot(TEST_ONE)
})

it('test B', { skip: skip || wrongSerialization }, (t) => {
  t.assert.snapshot(TEST_TWO)
})

it('test B', { skip: skip || wrongSerialization }, (t) => {
  t.assert.snapshot(TEST_THREE)
})

// Repeat name
it('test B', { skip: skip || wrongSerialization }, (t) => {
  t.assert.snapshot({ x: 1337 })
})

describe('nested test', { skip }, () => {
  it('test A', { skip: wrongSerialization }, (t) => {
    t.assert.snapshot(TEST_TWO)
  })

  it('test A', { skip: wrongSerialization }, (t) => {
    t.assert.snapshot(TEST_THREE)
  })

  it('nested test one', (t) => {
    t.assert.snapshot(TEST_ONE)
  })
})

describe('weird  names', { skip }, () => {
  const ascii = Array.from({ length: 128 })
    .fill()
    .map((a, i) => i)
    .slice(0x20)
    .map((i) => String.fromCodePoint(i))
    .join('')
  for (const key of [
    '\n',
    '{}',
    '$',
    '`',
    '>',
    '` ` `',
    '` `\n `',
    '\\',
    '\\\n`\n\\``',
    '${',
    ascii,
  ]) {
    it(key, (t) => {
      t.assert.snapshot(key)
    })
  }

  it('multi\nline', { skip }, (t) => {
    t.assert.snapshot(0)
  })

  it('with `', { skip }, (t) => {
    t.assert.snapshot(42)
  })
})

describe('', { skip }, () => {
  it('', (t) => {
    t.assert.snapshot('empty names test')
    t.assert.snapshot(t.fullName)
    t.assert.snapshot(t.name)
  })

  it((t) => {
    t.assert.snapshot('no name test')
    t.assert.snapshot(t.fullName)
    t.assert.snapshot(t.name)
  })

  // non-string names
  for (const name of [false, true, 0, 1, null, undefined, {}, ['arr'], 'str']) {
    it(name, (t) => {
      t.assert.snapshot(t.fullName)
      t.assert.snapshot(t.name)
    })
  }
})
