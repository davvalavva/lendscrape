/* eslint-disable no-await-in-loop */
const typeName = require('type-name')
const kasper = require('kasper')
const ValidationError = require('../errors/validation-error')
const settledTaskFactory = require('./settled-task-factory')
const { printError, logError, filepath, debugMode: debug, enableLogging: log } = require('../helpers/common-debug-tools.js') // eslint-disable-line

module.exports = async function taskRunner(tasks, schemas, accSettledTasks = [], firstRun = true) {
  let tryAgain = []
  let settledTasks = accSettledTasks
  const validateTask = task => kasper.validate(schemas[task.scraperName], task)

  let err
  try {
    if (tasks === undefined) {
      err = new ReferenceError(`Missing arguments, expected two arguments`)
    } else if (schemas === undefined) {
      err = new ReferenceError(`Missing 2nd argument, expected an object`)
    } else if (typeName(accSettledTasks) !== 'Array') {
      err = new TypeError(`Wrong type 3rd argument. Please don't pass a 3rd arg., it is only meant to be used for recursive calls.`)
    } else if (typeName(firstRun) !== 'boolean') {
      err = new TypeError(`Wrong type 4th argument. Please don't pass a 4th arg., it is only meant to be used for recursive calls.`)
    } else if (typeName(tasks) !== 'Array') {
      err = new TypeError(`Wrong type for 1st argument, expected an array, found type '${typeName(tasks)}'`)
    } else if (typeName(schemas) !== 'Object') {
      err = new TypeError(`Wrong type for 2nd argument, expected an object, found type '${typeName(schemas)}'`)
    }
    if (!err) {
      for (const task of tasks) {
        try {
          if (firstRun) { // pointless to validate tasks more than once
            const returned = validateTask(task)
            if (returned.result == null) {
              err = new ValidationError(`Invalid configuration of task`)
              err.subject = task
              err.kasper = returned.err.message
              throw err
            }
          }
          console.log(`\nAttempt #${task.attemptNo} for '${task.creditor}' >>> ${task.targetURL}`)

          const result = task.isAsyncScraper
            ? await task.scraper(task)
            : task.scraper(task)

          task.result = { success: true, documents: result.documents, response: result.response }
          settledTasks = [...settledTasks, task]
          console.log(`Completed!\n`)

        // (predominantly) Operational errors
        } catch (e) {
          const settledTask = settledTaskFactory(task, e)

          if (settledTask) {
            settledTasks = [...settledTasks, settledTask]
            if (settledTask.result.message) {
              console.log(settledTask.result.message)
            }
            if (settledTask.result.kasper) {
              console.log(`Kasper:\n${settledTask.result.kasper}`)
            }
          } else {
            task.attemptNo += 1
            tryAgain = [...tryAgain, task]
          }
        }
      }
    }
    if (tryAgain.length > 0) {
      await taskRunner(tryAgain, settledTasks, false)
    }
    // Programmer errors (outside for...of loop dealing with running the tasks)
    if (err) {
      err.signature = 'async function(tasks, schemas [, accSettledTasks = [] [, firstRun = []]])'
      err.args = [
        {
          position: 0, required: true, expectedType: 'array', foundType: typeName(tasks), foundValue: tasks
        },
        {
          position: 1, required: true, expectedType: 'object', foundType: typeName(schemas), foundValue: schemas
        },
        {
          position: 2, required: true, expectedType: 'array', foundType: typeName(accSettledTasks), foundValue: accSettledTasks
        },
        {
          position: 3, required: true, expectedType: 'boolean', foundType: typeName(firstRun), foundValue: firstRun
        }
      ]
      err.path = filepath(__filename)
      throw err
    }
  } catch (e) {
    if (debug === 1) printError(e)
    if (log) logError(e)
    throw e
  }
  return settledTasks
}
