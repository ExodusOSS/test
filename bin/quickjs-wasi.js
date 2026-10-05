// Host for the quickjs-wasi:bundle engine: QuickJS (quickjs-ng) compiled to WebAssembly, run on Node.js
// Provides what barebone engines are expected to have: print(), timers and gc(), mimicking `qjs --std`

import { readFile } from 'node:fs/promises'
import { QuickJS, JSException, MAX_STACK_SIZE } from 'quickjs-wasi'

const abort = (message) => {
  console.error(message)
  process.exit(1)
}

if (process.argv[1] !== import.meta.filename) abort('Unexpected launcher script')
const files = process.argv.slice(2)
if (files.length === 0) abort('No files to run')

const [wasm, ...sources] = await Promise.all([
  readFile(new URL(import.meta.resolve('quickjs-wasi/quickjs.wasm'))),
  ...files.map((file) => readFile(file, 'utf8')),
])

// Unhandled rejections are checked after the microtask queue is drained, like in qjs
const rejections = new Map() // promise identity => [promise, reason] handles, kept alive while tracked
const onUnhandledRejection = (promise, reason, isHandled) => {
  const key = promise.identity
  if (isHandled) {
    for (const handle of rejections.get(key) ?? []) handle.dispose()
    rejections.delete(key)
  } else {
    rejections.set(key, [promise.dup(), reason.dup()])
  }
}

// Compiled synchronously, async compilation was observed to delay the first timers by tens of ms
const module = new WebAssembly.Module(wasm)
// maxStackSize makes deep recursion a catchable RangeError instead of exhausting the WebAssembly stack
const vm = await QuickJS.create({
  wasm: module,
  maxStackSize: MAX_STACK_SIZE,
  onUnhandledRejection,
})

// Timers are stored in the guest, the host only tracks numeric ids
const prelude = `(function (write, startTimer, stopTimer, gc) {
  'use strict'
  const { String, Number, Map, Error } = globalThis
  const timers = new Map()
  let lastId = 0
  const schedule = (callback, delay, args, repeat) => {
    if (typeof callback !== 'function') throw new TypeError('The "callback" argument must be of type function')
    const id = ++lastId
    const ms = Number(delay)
    timers.set(id, { callback, args, ms, repeat })
    startTimer(id, ms)
    return id
  }

  const clear = (id) => {
    const key = Number(id)
    if (timers.delete(key)) stopTimer(key)
  }

  globalThis.print = (...args) => write(args.map((arg) => String(arg)).join(' '))
  globalThis.gc = () => gc()
  globalThis.setTimeout = (callback, delay, ...args) => schedule(callback, delay, args, false)
  globalThis.setInterval = (callback, delay, ...args) => schedule(callback, delay, args, true)
  globalThis.clearTimeout = (id) => clear(id)
  globalThis.clearInterval = (id) => clear(id)

  // Returns [callback, ...args] for the host to call, so that no extra frames end up in stack traces
  const take = (id) => {
    const timer = timers.get(id)
    if (!timer) return
    if (timer.repeat) {
      startTimer(id, timer.ms)
    } else {
      timers.delete(id)
    }

    return [timer.callback, ...timer.args]
  }

  // Same format as js_std_dump_error1() in quickjs-libc
  const isError = Error.isError ?? ((value) => value instanceof Error)
  const describe = (value) => {
    try {
      const text = String(value)
      if (!isError(value) || value.stack === undefined) return text
      return text + '\\n' + String(value.stack)
    } catch {
      return '[exception]'
    }
  }

  return { take, describe }
})`

const timers = new Map() // id => Node.js timeout
const hostFunction = (name, fn) => vm.newFunction(name, (...args) => fn(...args) ?? vm.undefined)
const write = hostFunction('write', (text) => void process.stdout.write(`${text.toString()}\n`))
const gc = hostFunction('gc', () => vm.runGC())
const stopTimer = hostFunction('stopTimer', (idHandle) => {
  const id = idHandle.toNumber()
  clearTimeout(timers.get(id))
  timers.delete(id)
})
const startTimer = hostFunction('startTimer', (idHandle, delayHandle) => {
  const id = idHandle.toNumber()
  const delay = delayHandle.toNumber()
  const ms = delay >= 1 && delay <= 2 ** 31 - 1 ? delay : 1 // same as Node.js does, minus the warnings
  const timeout = setTimeout(() => {
    timers.delete(id)
    task(() => runTimer(id))
  }, ms)
  timers.set(id, timeout)
})

function runTimer(id) {
  const entry = vm.newNumber(id).consume((arg) => vm.callFunction(take, vm.undefined, arg))
  if (entry.isUndefined) return entry.dispose() // cleared
  // The entry handle keeps the callback alive while it runs, even if it clears its own timer
  const [callback, ...args] = Array.from({ length: entry.length }, (_, i) => entry.getProp(`${i}`))
  try {
    vm.callFunction(callback, vm.undefined, ...args).dispose()
  } finally {
    for (const handle of [entry, callback, ...args]) handle.dispose()
  }
}

const api = vm.evalCode(prelude, '<exodus-test>').consume((fn) => {
  return vm.callFunction(fn, vm.undefined, write, startTimer, stopTimer, gc)
})
const take = api.getProp('take')
const describe = api.getProp('describe')
for (const handle of [api, write, startTimer, stopTimer, gc]) handle.dispose()

let crashed = false
const crash = (message) => {
  crashed = true
  process.exitCode = 1
  for (const timeout of timers.values()) clearTimeout(timeout)
  timers.clear()
  process.stderr.write(`${message}\n`)
}

const format = (handle) => {
  try {
    return vm.callFunction(describe, vm.undefined, handle).consume((x) => x.toString())
  } catch {
    return '[exception]'
  }
}

// Run a macrotask, then drain microtasks and check for unhandled rejections
function task(fn) {
  if (crashed) return
  try {
    fn()
    vm.executePendingJobs()
  } catch (err) {
    return crash(err instanceof JSException ? format(err.handle) : err?.stack ?? err)
  }

  if (rejections.size === 0) return
  const reasons = [...rejections.values()].map(([, reason]) => format(reason))
  crash(reasons.map((reason) => `Possibly unhandled promise rejection: ${reason}`).join('\n'))
}

for (const [i, file] of files.entries()) task(() => vm.evalCode(sources[i], file).dispose())
