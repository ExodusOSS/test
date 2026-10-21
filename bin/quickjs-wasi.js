// Host for the quickjs-wasi:bundle engine: QuickJS (quickjs-ng) compiled to WebAssembly, run on Node.js
// Provides what barebone engines are expected to have: print(), timers and gc(), mimicking `qjs --std`

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { QuickJS, JSException, MAX_STACK_SIZE } from 'quickjs-wasi'

const [, script, file, ...extra] = process.argv
assert(script === import.meta.filename && file && extra.length === 0, 'Unexpected launcher script')

// Reported after the microtask queue is drained, like in qjs
const rejections = new Map() // promise identity => [promise, reason], kept alive while tracked
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
const wasm = new WebAssembly.Module(
  readFileSync(new URL(import.meta.resolve('quickjs-wasi/quickjs.wasm')))
)
// maxStackSize makes deep recursion a catchable RangeError instead of exhausting the WebAssembly stack
const vm = await QuickJS.create({ wasm, maxStackSize: MAX_STACK_SIZE, onUnhandledRejection })

const hostFunction = (name, fn) =>
  vm.newFunction(name, (...args) => {
    fn(...args.map((arg) => vm.dump(arg)))
    return vm.undefined
  })

const timers = new Map() // id => Node.js timeout
const write = hostFunction('write', (text) => process.stdout.write(`${text}\n`))
const gc = hostFunction('gc', () => vm.runGC())
const stopTimer = hostFunction('stopTimer', (id) => {
  clearTimeout(timers.get(id))
  timers.delete(id)
})
const startTimer = hostFunction('startTimer', (id, delay) => {
  const ms = delay >= 1 && delay <= 2 ** 31 - 1 ? delay : 1 // same as Node.js does, minus the warnings
  const fire = () => {
    timers.delete(id)
    task(() => runTimer(id))
  }

  timers.set(id, setTimeout(fire, ms))
})

// Timers are stored in the guest, the host only tracks numeric ids
// take(id) returns the bound callback, called by the host so that stack traces have no extra frames
const prelude = `(function (write, startTimer, stopTimer, gc) {
  'use strict'
  const { apply } = Reflect
  const { bind } = Function.prototype
  const timers = new Map()
  let lastId = 0
  const schedule = (callback, delay, args, repeat) => {
    const id = ++lastId
    const ms = Number(delay)
    timers.set(id, { callback: apply(bind, callback, [undefined, ...args]), ms, repeat })
    startTimer(id, ms)
    return id
  }

  globalThis.print = (...args) => write(args.map(String).join(' '))
  globalThis.gc = gc
  globalThis.setTimeout = (callback, delay, ...args) => schedule(callback, delay, args, false)
  globalThis.setInterval = (callback, delay, ...args) => schedule(callback, delay, args, true)
  globalThis.clearTimeout = globalThis.clearInterval = (id) => {
    const key = Number(id)
    if (timers.delete(key)) stopTimer(key)
  }

  return (id) => {
    const timer = timers.get(id)
    if (timer?.repeat) startTimer(id, timer.ms)
    else timers.delete(id)
    return timer?.callback
  }
})`

const take = vm.evalCode(prelude, '<exodus-test>').consume((fn) => {
  return vm.callFunction(fn, vm.undefined, write, startTimer, stopTimer, gc)
})

function runTimer(id) {
  const callback = vm.newNumber(id).consume((arg) => vm.callFunction(take, vm.undefined, arg))
  // This handle keeps the callback alive while it runs, even if it clears its own timer
  callback.consume(() => {
    if (!callback.isUndefined) vm.callFunction(callback, vm.undefined).dispose()
  })
}

// Same output as js_std_dump_error1() in quickjs-libc
const describe = vm.evalCode(
  `(value) => String(value) + (Error.isError(value) && value.stack !== undefined ? '\\n' + value.stack : '')`,
  '<exodus-test>'
)
const format = (value) => {
  try {
    return vm.callFunction(describe, vm.undefined, value).consume((text) => text.toString())
  } catch {
    return '[exception]'
  }
}

let crashed = false
const crash = (message) => {
  crashed = true
  process.exitCode = 1
  for (const timeout of timers.values()) clearTimeout(timeout)
  process.stderr.write(`${message}\n`)
}

// Run a macrotask, then drain microtasks and report unhandled rejections
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

task(() => vm.evalCode(readFileSync(file, 'utf8'), file).dispose())
