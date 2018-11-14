const path = require('path')
const creditorsCfg = require('./config/creditors.json')
const createTasks = require('./create-tasks.js')
const runTasks = require('./run-tasks.js')
const printError = require('./errors/print-error')
const logError = require('./lib/log-error')
const { defaultMaxRetries } = require('./config/runtime.json')
const { OS, projectRoot } = require('./config/env.json')
const { debugMode, enableLogging } = require('./config/runtime.json')

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${projectRoot}${fName}`

// override config in 'runtime.json'
const debug = debugMode // 0 = no debug, 1 = normal, 2 = testing
const log = enableLogging // true|false

const creditors = creditorsCfg.filter(creditor => creditor.parse)

async function main(failed = []) {
  const tasks = createTasks(creditors, failed)
  const result = await runTasks(tasks, creditors, failed)
  return result
}

async function repeatUntilNoRetriesLeft(_tryAgain, _halted, _collection) {
  const halted = [..._halted]
  let collection = [..._collection]
  let tryAgain = [..._tryAgain]
    .filter((task) => {
      if (task.attemptNo > (task.maxRetries || defaultMaxRetries)) {
        halted.push(task)
        return false
      }
      return true
    })

  tryAgain = tryAgain.map((obj) => {
    const task = { ...obj }
    task.attemptNo += 1
    return task
  })

  if (tryAgain.length > 0) {
    let documents
    ({ documents, tryAgain } = await main(tryAgain))
    collection = [..._collection, ...documents]
    await repeatUntilNoRetriesLeft(tryAgain, halted, collection)
  }
  return { tryAgain, halted, collection }
}

async function run() {
  const result = await main()
  const { tryAgain } = result
  let { halted, documents: collection } = result
  const finalResult = await repeatUntilNoRetriesLeft(tryAgain, halted, collection); // ASI
  ({ halted, collection } = finalResult)

  console.log(`\n************************************\nSuccessfully parsed ${collection.length} documents:\n${JSON.stringify(collection, null, 2)}`)
  if (halted.length > 0) {
    console.log(`\n************************************\nFailures:`)
    halted.forEach((task) => {
      console.log(`${task.creditor} [${task.targetURL}]: ${task.attemptNo > 1 ? `${task.attemptNo} attempts were made` : 'No attempts retrying'}`)
    })
  }
}

run().catch((e) => {
  e.path = filepath
  if (debug) {
    if (debug === 1) printError(e)
    if (log) logError(e)
  }
  throw e
})
