const path = require('path')
const main = require('./main/main.js')
const retry = require('./main/retry.js')
const printError = require('./errors/print-error')
const logError = require('./lib/log-error')
const { OS, projectRoot } = require('./config/env.json')
const { debugMode, enableLogging } = require('./config/runtime.json')

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${projectRoot}${fName}`

// override config in 'runtime.json'
const debug = debugMode // 0 = no debug, 1 = normal, 2 = testing
const log = enableLogging // true|false

async function run() {
  const result = await main()
  const { halted, collection } = await retry(result.tryAgain, result.halted, result.documents, main)

  console.log(`\n************************************\nSuccessfully parsed ${collection.length} documents:\n${JSON.stringify(collection, null, 2)}`)
  if (halted.length > 0) {
    console.log(`\n************************************\nFailures:`)
    halted.forEach((task) => {
      console.log(`${task.creditor} [${task.targetURL}]: ${task.attemptNo > 1 ? `${task.attemptNo} attempts were made` : 'No attempts retrying'}`)
    })
  }
}

(async () => {
  try {
    await run()
  } catch (e) {
    e.path = filepath
    if (debug === 1) printError(e)
    if (log) logError(e)
    throw e
  }
})()
