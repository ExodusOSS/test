// ESM version is the same as for Deno
import deno from './deno-import-map.json' with { type: 'json' }

const remap = new Map(Object.entries(deno.imports))

export function resolve(specifier, context, nextResolve) {
  if (!remap.has(specifier)) return nextResolve(specifier)
  return { url: new URL(remap.get(specifier), import.meta.url).toString(), shortCircuit: true }
}
