const typeName = require('type-name')
const requestPromiseNative = require('request-promise-native')
const hasValidationErrors = require('../lib/has-validation-errors')
const { printError, logError, filepath, debugMode: debug, enableLogging: log } = require('../helpers/common-debug-tools.js') // eslint-disable-line
const ValidationError = require('../errors/validation-error')
const scrapers = require('../scrapers')

module.exports = function taskFactory(creditors, schemas) {
  let tasks
  try {
    if (creditors === undefined) {
      throw new ReferenceError(`Missing arguments, expected two arguments`)
    }
    if (schemas === undefined) {
      throw new ReferenceError(`Missing 2nd argument, expected an object`)
    }
    if (typeName(creditors) !== 'Array') {
      throw new TypeError(`Wrong type for 1st argument, expected an array, found type '${typeName(creditors)}'`)
    }
    if (typeName(schemas) !== 'Object') {
      throw new TypeError(`Wrong type for 2nd argument, expected an object, found type '${typeName(schemas)}'`)
    }
    tasks = creditors
      .map((creditor) => {
        const ajvErrors = hasValidationErrors(schemas.staticTableCreditor, creditor)
        if (ajvErrors) {
          const err = new ValidationError(`Invalid configuration of creditor '${creditor.name}'`)
          err.ajv = ajvErrors
          throw err
        }
        switch (creditor.task) {
          case 'staticTable':
            return {
              attemptNo: 1,
              maxAttempts: creditor.maxAttempts,
              creditor: creditor.name,
              scraper: scrapers.staticTable,
              request: requestPromiseNative,
              targetURL: creditor.targetURL,
              documentSchema: creditor.documentSchema,
              hdSelector: creditor.hdSelector,
              trSelector: creditor.trSelector,
              labelMap: creditor.labelMap,
              fieldInject: creditor.fieldInject,
              async execute() { return this.scraper(this) }
            }
          default:
            throw new Error('Not implemented!')
        }
      })
  } catch (e) {
    e.path = filepath(__filename)
    if (debug === 1) printError(e)
    if (log) logError(e)
    throw e
  }
  return tasks
}
