let mockModule
let builtinModules = []
let requireIsRelative = false
let relativeRequire, baseFile, isTopLevelESM, syncBuiltinESMExports
if (process.env.EXODUS_TEST_ENVIRONMENT === 'bundle') {
  // eslint-disable-next-line no-undef
  const files = EXODUS_TEST_FILES
  baseFile = files.length === 1 ? files[0] : undefined
  isTopLevelESM = () => false
} else {
  const { existsSync } = require('node:fs')
  const { normalize } = require('node:path')
  const nodeModule = require('node:module')
  const files = process.argv.slice(1)
  baseFile = files.length === 1 && existsSync(files[0]) ? normalize(files[0]) : undefined
  requireIsRelative = Boolean(baseFile)
  relativeRequire = baseFile ? nodeModule.createRequire(baseFile) : require
  isTopLevelESM = () =>
    !baseFile || // assume ESM otherwise
    !Object.hasOwn(relativeRequire.cache, baseFile) || // node esm
    relativeRequire.cache[baseFile].exports[Symbol.toStringTag] === 'Module' // bun esm
  builtinModules = nodeModule.builtinModules
  syncBuiltinESMExports = nodeModule.syncBuiltinESMExports || nodeModule.syncBuiltinExports // bun has it under a different name (also a no-op and always synced atm)
}

if (
  process.env.EXODUS_TEST_ENGINE === 'node:pure' ||
  process.env.EXODUS_TEST_ENGINE === 'electron-as-node:pure'
) {
  // Try load module mocks from node:test, if present
  try {
    const nodeTest = require('node:test')
    mockModule = nodeTest.mock.module.bind(nodeTest.mock)
  } catch {}
}

/* eslint-disable unicorn/no-useless-spread */
module.exports = {
  ...{ mockModule, builtinModules, syncBuiltinESMExports },
  ...{ requireIsRelative, relativeRequire, baseFile, isTopLevelESM },
}
/* eslint-enable unicorn/no-useless-spread */
