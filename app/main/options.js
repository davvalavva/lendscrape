const path = require('path')
const typeName = require('type-name')
const schemas = require('../schemas')
const ValidationError = require('../errors/validation-error')
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

const TABLE_SCRAPER = 'static-table'

module.exports = (task, cfg) => {
  // for debugging and testing, overrides 'runtime.json' settings
  const debug = cfg && typeName(cfg.debug) === 'number'
    ? cfg.debug
    : debugMode // 0 = no debug, 1 = normal, 2 = testing
  const log = cfg && typeName(cfg.log) === 'boolean'
    ? cfg.log
    : enableLogging // boolean
  const options = {}

  try {
    let err
    if (task === undefined) {
      err = new ReferenceError(`Missing required argument! Expected an object`)
    }
    if (!err) {
      switch (task.scraperName) {
        case TABLE_SCRAPER:
          options.targetURL = task.targetURL
          options.labelMap = task.labelMap
          options.fieldInject = task.fieldInject
          options.hdSelector = task.hdSelector
          options.tdSelector = task.tdSelector
          break
        default:
          err = new ValidationError(`Implementation for scraper '${task.scraperName}' wasn't found.`)
      }
    }

    switch (task.schema) {
      case 'payday-simple-1':
        options.schema = schemas['payday-simple-1']
        break
      default:
        throw new Error('Invalid schema for task')
    }
    if (err) {
      err.signature = 'function(task)'
      err.args = [
        {
          position: 0, required: true, expectedType: 'object', foundType: typeName(task), foundValue: task
        }
      ]
      err.path = filepath
      throw err
    }
  } catch (e) {
    if (debug === 1) printError(e)
    if (log) logError(e)
    throw e
  }

  return options
}
