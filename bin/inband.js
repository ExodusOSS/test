import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { describe, after } from '../src/engine.js'
import { restartFileTimeout } from '../loader/file-timeout.js'

const files = JSON.parse(process.env.EXODUS_TEST_INBAND)
if (!Array.isArray(files)) throw new Error('Unexpected')

for (const file of files.sort()) {
  restartFileTimeout(file)
  await describe(`EXODUS_TEST_INBAND:${file}`, async () => {
    await import(pathToFileURL(resolve(file)))
  })
}

if (globalThis.EXODUS_TEST_AFTER_INBAND) after(globalThis.EXODUS_TEST_AFTER_INBAND)
