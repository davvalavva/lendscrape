/** @module task-runner */

/* eslint-disable max-len */
/**
 * @function
 * @todo write a description
 *
 * PARAMETERS     Type        Name    Required    Description
 * ================================================================================================================================================
 * @param         {object}    cfg       yes       @todo write a description
 *
 *
 * @return {object[]} @todo write a description
 */
/* eslint-enable max-len */

const typeName = require('type-name')
const errorResult = require('./lib/error-result')

module.exports = async function taskRunner(cfg) {
  if (typeName(cfg) !== 'Object') throw new TypeError(`Expected an object as argument, found type '${typeName(cfg)}'.`)
  if (typeName(cfg.tasks) !== 'Array' || cfg.tasks.length === 0) throw new TypeError(`Expected property 'tasks' in argument to be a non empty array, found type '${typeName(cfg.tasks)}'.`)
  if (cfg.accSettledTasks !== undefined && typeName(cfg.accSettledTasks) !== 'Array') throw new TypeError(`Expected property 'accSettledTasks' in argument to be an array, found type '${typeName(cfg.accSettledTasks)}'.`)

  const { tasks, accSettledTasks = [] } = cfg
  let tryAgain = []
  let settledTasks = accSettledTasks

  /* eslint-disable no-await-in-loop */
  for (const task of tasks) {
    try {
      console.log(`\nAttempt #${task.attemptNo} for '${task.creditor}' >>> ${task.targetURL}`)
      const result = await task.execute()
      task.result = { documents: result.documents }
      settledTasks = [...settledTasks, task]
      console.log(`...Success!\n`)

    // OPERATIONAL ERRORS
    } catch (e) {
      const result = errorResult(task, e)

      if (result) {
        console.log(`...Failed, aborting!\n`)
        settledTasks = [...settledTasks, { ...task, result }]
      } else {
        console.log(`...Failed, retrying!\n`)
        task.attemptNo += 1
        tryAgain = [...tryAgain, task]
      }
    }
  }
  if (tryAgain.length > 0) {
    settledTasks = await taskRunner({ tasks: tryAgain, accSettledTasks: settledTasks })
  }

  return settledTasks
}
