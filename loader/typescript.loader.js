import { isUtf8 } from 'node:buffer'
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

// amaro < 1.2 writes blanks of the same UTF-8 length, 1.2+ writes spaces
const blanks = new Set([' ', '\u00A0', '\u2002', '\uFEFF'])

const { URL } = globalThis

export async function load(url, context, nextLoad) {
  if (shouldProcessUrl(url)) {
    const sourceBuf = await readFile(new URL(url))
    if (!isUtf8(sourceBuf)) throw new Error('invalid utf-8')
    const decoded = sourceBuf.toString('utf8')
    // Node drops a byte order mark when reading a module, and so does stripping
    const source = decoded.startsWith('\uFEFF') ? decoded.slice(1) : decoded
    const transformed = stripTypeScriptTypes(source, { mode: 'strip' })
    if (source.length !== transformed.length) throw new Error('length mismatch')
    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < transformed.length; i++) {
      // should match either the source or blanks or semicolon: https://github.com/swc-project/swc/issues/9331
      const val = transformed[i]
      if (val !== source[i] && !blanks.has(val) && val !== ';') throw new Error('result mismatch')
    }

    return { format: 'module', source: transformed, shortCircuit: true }
  }

  return nextLoad(url, context)
}
