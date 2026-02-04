const nodeModule = require('node:module')
const { pathToFileURL } = require('node:url')

const remap = new Map(Object.entries(require('./deno-import-map.json').imports))
const resolveFile = (f) => require.resolve(f.endsWith('tape.js') ? `${f.slice(0, -2)}cjs` : f)

function resolve(specifier, context, nextResolve) {
  if (!remap.has(specifier)) return nextResolve(specifier)
  return { url: pathToFileURL(resolveFile(remap.get(specifier))).toString(), shortCircuit: true }
}

if (nodeModule.registerHooks) {
  nodeModule.registerHooks({ resolve })
} else if (globalThis.Bun) {
  const { mock } = require('bun:test')
  for (const [k, v] of remap) mock.module(k, () => (v.endsWith('jest.js') ? import(v) : require(v)))
} else {
  if (nodeModule.register) nodeModule.register('./remap.loader.js', pathToFileURL(__filename))
  if (nodeModule._resolveFilename) {
    const { _resolveFilename } = nodeModule
    nodeModule._resolveFilename = function (request, parent, isMain, options) {
      if (remap.has(request)) return resolveFile(remap.get(request))
      return _resolveFilename.call(this, request, parent, isMain, options)
    }
  }
}
