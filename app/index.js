const {
  printError, logError, filepath, debugMode, enableLogging
} = require('./helpers/common-debug-tools.js')
const creditorsCfg = require('./config/creditors.json')
const main = require('./main/main.js')
const retry = require('./main/retry.js')

// override config in 'runtime.json'
const debug = debugMode // 0 = no debug, 1 = normal, 2 = testing
const log = enableLogging; // true|false

(async function runtime() {
  const creditors = creditorsCfg.filter(creditor => creditor.parse)
  const result = await main(creditors)
  const {
    halted, collection
  } = await retry(creditors, result.tryAgain, result.halted, result.documents, main)

  console.log(`\n************************************\nSuccessfully parsed ${collection.length} documents:\n${JSON.stringify(collection, null, 2)}`)
  if (halted.length > 0) {
    console.log(`\n************************************\nFailures:`)
    halted.forEach((task) => {
      console.log(`${task.creditor} [${task.targetURL}]: ${task.attemptNo > 1 ? `${task.attemptNo} attempts were made` : 'No attempts retrying'}`)
    })
  }
}())
  .catch((e) => {
    e.path = filepath(__filename)
    if (debug === 1) printError(e)
    if (log) logError(e)
    throw e
  })
