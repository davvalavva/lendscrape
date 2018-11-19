const typeName = require('type-name')
const { printError, logError, filepath, debugMode: debug, enableLogging: log } = require('../helpers/common-debug-tools.js') // eslint-disable-line
const ValidationError = require('../errors/validation-error')
const schemas = require('../schemas')

module.exports = async function main(args) {
  let settledTasks
  let err
  try {
    if (args === undefined) {
      err = new ReferenceError(`Missing argument, expected an object`)
    } else if (typeName(args) !== 'Object') {
      err = new TypeError(`Wrong type for given argument, expected an object, found type '${typeName(args)}'`)
    } else if (typeName(args.creditors) !== 'Array') {
      err = new ValidationError(`Missing property 'creditors' in object given as argument`)
    } else if (typeName(args.taskFactory) !== 'function') {
      err = new ValidationError(`Missing property 'taskFactory' in object given as argument`)
    } else if (typeName(args.taskRunner) !== 'function') {
      err = new ValidationError(`Missing property 'taskRunner' in object given as argument`)
    }
    if (!err) {
      const { creditors, taskFactory, taskRunner } = args
      const tasks = taskFactory(creditors, schemas)
      settledTasks = await taskRunner(tasks, schemas)
    }
    if (err) {
      err.signature = 'function(data)'
      err.args = [{ position: 0, required: true, expectedType: 'object', foundType: typeName(args), foundValue: args }] // eslint-disable-line
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
