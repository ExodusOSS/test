import { relative } from 'node:path'
import { Worker } from 'node:worker_threads'

const watchdog = `
const { writeSync } = require('node:fs')
const { parentPort, workerData } = require('node:worker_threads')
let timer
const arm = (file) => {
  clearTimeout(timer)
  timer = setTimeout(() => {
    writeSync(2, \`\\n‼ FATAL File timeout of \${workerData.ms}ms reached, killing \${file}\\n\`)
    process.kill(process.pid, 'SIGKILL')
  }, workerData.ms)
}
parentPort.on('message', arm)
arm(workerData.file)
`

const ms = Number(process.env.EXODUS_TEST_FILE_TIMEOUT)
const isTestChild = process.env.NODE_TEST_CONTEXT?.startsWith('child')
const name = (file) => relative(process.cwd(), file)

let worker
if (ms > 0 && isTestChild) {
  worker = new Worker(watchdog, { eval: true, workerData: { ms, file: name(process.argv[1]) } })
  worker.unref()
}

export const restartFileTimeout = (file) => worker?.postMessage(name(file))
