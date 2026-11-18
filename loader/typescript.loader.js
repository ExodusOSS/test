import { readFile } from 'node:fs/promises'
import { stripTypeScriptTypes } from 'node:module' // 22.13.0+
import { fileURLToPath } from 'node:url'

const extensionsRegex = /\.[cm]?ts$/

function shouldProcessUrl(s) {
  if (!s.startsWith('file://') || !s.includes('ts') || s.includes('/node_modules/')) return false
  try {
    return extensionsRegex.test(fileURLToPath(s))
  } catch {
    return false
  }
}

// What stripping writes for each UTF-16 unit it erases is a blank: up to amaro 1.1, one of as many UTF-8 bytes
// (a space, a no-break space, an en space; a space and a byte order mark for four), and from amaro 1.2 a space
const blanks = new Set([' ', '\u00A0', '\u2002', '\uFEFF'])

const { URL } = globalThis

export async function load(url, context, nextLoad) {
  if (shouldProcessUrl(url)) {
    const source = await readFile(new URL(url), 'utf8')
    const transformed = stripTypeScriptTypes(source, { mode: 'strip' })
    if (source.length !== transformed.length) throw new Error('length mismatch') // in units, kept either way
    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < transformed.length; i++) {
      // should match either the source or a blank or semicolon: https://github.com/swc-project/swc/issues/9331
      const val = transformed[i]
      if (val !== source[i] && !blanks.has(val) && val !== ';') throw new Error('result mismatch')
    }

    return { format: 'module', source: transformed, shortCircuit: true }
  }

  return nextLoad(url, context)
}
