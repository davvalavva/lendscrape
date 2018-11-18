const kasper = require('kasper')
const typeName = require('type-name')
const { printError, logError, filepath, debugMode: debug, enableLogging: log } = require('../helpers/common-debug-tools.js') // eslint-disable-line
const ValidationError = require('../errors/validation-error')
const scrapers = require('../scrapers')
const schemas = require('../schemas')
const {
  SCRAPER_STATIC_TABLE,
  SCHEMA_PAYDAY_SIMPLE_1
} = require('./constants.js')


module.exports = function taskFactory(creditors) {
  let tasks
  let err
  try {
    if (creditors === undefined) {
      err = new ReferenceError(`Missing argument, expected an object`)
    } else if (typeName(creditors) !== 'Array') {
      err = new TypeError(`Wrong type for given argument, expected an array`)
    }
    if (!err) {
      tasks = creditors
        .map((creditor) => {
          const validationResult = kasper.validate(schemas.creditor, creditor)
          if (validationResult.err) {
            err = new ValidationError(`Invalid configuration of creditor`)
            err.subject = creditor
            err.kasper = validationResult
            throw err
          }
          switch (creditor.scraper.name) {
            case SCRAPER_STATIC_TABLE:
              return {
                attemptNo: 1,
                maxAttempts: creditor.maxAttempts || null,
                creditor: creditor.name,
                scraper: scrapers[creditor.scraper.name],
                isAsyncScraper: creditor.scraper.async,
                scraperName: creditor.scraper.name,
                payload: creditor.payload,
                targetURL: creditor.targetURL,
                schema: schemas[SCHEMA_PAYDAY_SIMPLE_1],
                hdSelector: creditor.scraper.hdSelector,
                tdSelector: creditor.scraper.tdSelector,
                labelMap: creditor.labelMap,
                fieldInject: creditor.fieldInject || null
              }
            default:
              throw new Error('Not implemented!')
          }
        })
    }
    if (err) {
      err.path = filepath(__filename)
      throw err
    }
  } catch (e) {
    if (debug === 1) printError(e)
    if (log) logError(e)
    throw e
  }
  return tasks
}
