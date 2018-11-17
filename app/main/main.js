const kasper = require('kasper')
const path = require('path')
const typeName = require('type-name')
const ValidationError = require('../errors/validation-error')
const runTasks = require('../main/run-tasks.js')
const createTasks = require('../main/create-tasks.js')
const schemas = require('../schemas')
const printError = require('../errors/print-error')
const logError = require('../lib/log-error')
const {
  OS,
  projectRoot
} = require('../config/env.json')
const {
  debugMode,
  enableLogging
} = require('../config/runtime.json')

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${projectRoot}${fName}`

module.exports = async function main(creditors, tryAgain = [], cfg) {
  // for debugging and testing, overrides 'runtime.json' settings
  const debug = cfg && typeName(cfg.debug) === 'number'
    ? cfg.debug
    : debugMode // 0 = no debug, 1 = normal, 2 = testing
  const log = cfg && typeName(cfg.log) === 'boolean'
    ? cfg.log
    : enableLogging // boolean

  let result
  try {
    const tasks = createTasks(creditors, tryAgain)
    let err
    tasks.forEach((task) => {
      const scraperName = task && task.scraperName
      if (typeName(scraperName) !== 'string') {
        err = new ValidationError(`Missing property 'scraperName' or the value isn't a string`)
      }
      if (!err) {
        const validationResult = kasper.validate(schemas[scraperName], task)
        if (validationResult.err) {
          err = new ValidationError(`Task doesn't validate with given schema.`)
          err.kasper = validationResult
        }
      }
      if (err) {
        err.path = filepath
        throw err
      }
    })
    result = await runTasks(tasks, creditors, tryAgain)
  } catch (e) {
    if (debug === 1) printError(e)
    if (log) logError(e)
    throw e
  }
  return result
}
