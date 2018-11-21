/* eslint-disable no-await-in-loop */
const typeName = require('type-name')
const settledTaskFactory = require('./settled-task-factory')
const { printError, logError, filepath, debugMode: debug, enableLogging: log } = require('../helpers/common-debug-tools.js') // eslint-disable-line

module.exports = async function taskRunner(tasks, schemas, accSettledTasks = [], firstRun = true) {
  let tryAgain = []
  let settledTasks = accSettledTasks

  try {
    if (typeName(tasks) !== 'Array') {
      throw new TypeError(`Wrong type for 1st argument, expected an array, found type '${typeName(tasks)}'`)
    }
    if (typeName(schemas) !== 'Object') {
      throw new TypeError(`Wrong type for 2nd argument, expected an object, found type '${typeName(schemas)}'`)
    }
    if (typeName(accSettledTasks) !== 'Array') {
      throw new TypeError(`Dont use 3rd arg, only used for recursive calls. Wrong type '${typeName(accSettledTasks)}' given.`)
    }
    if (typeName(firstRun) !== 'boolean') {
      throw new TypeError(`Dont use 4th arg, only used for recursive calls. Wrong type '${typeName(firstRun)}' given.`)
    }
    for (const task of tasks) {
      try {
        console.log(`\nAttempt #${task.attemptNo} for '${task.creditor}' >>> ${task.targetURL}`)
        const result = task.isAsyncScraper ? await task.scraper(task) : task.scraper(task)
        task.result = { documents: result.documents }
        settledTasks = [...settledTasks, task]
        console.log(`...Completed!\n`)

      // OPERATIONAL ERRORS (...predominantly)
      } catch (e) {
        const settledTask = settledTaskFactory(task, e)

        if (settledTask) {
          settledTasks = [...settledTasks, settledTask]
          console.log(`...Failed, aborting!\n`)
        } else {
          task.attemptNo += 1
          tryAgain = [...tryAgain, task]
          console.log(`...Failed, retrying!\n`)
        }
      }
    }
    if (tryAgain.length > 0) {
      settledTasks = await taskRunner(tryAgain, schemas, settledTasks, false)
    }

  // PROGRAMMER ERRORS
  } catch (e) {
    e.path = filepath(__filename)
    if (debug === 1) printError(e)
    if (log) logError(e)
    throw e
  }

  return settledTasks
}
