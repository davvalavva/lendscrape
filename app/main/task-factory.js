const kasper = require('kasper')
const typeName = require('type-name')
const requestPromiseNative = require('request-promise-native')
const { printError, logError, filepath, debugMode: debug, enableLogging: log } = require('../helpers/common-debug-tools.js') // eslint-disable-line
const ValidationError = require('../errors/validation-error')
const scrapers = require('../scrapers')
const {
  SCRAPER_STATIC_TABLE
} = require('./constants.js')


module.exports = function taskFactory(creditors, schemas) {
  let tasks
  let err
  try {
    if (creditors === undefined) {
      err = new ReferenceError(`Missing arguments, expected two arguments`)
    } else if (schemas === undefined) {
      err = new ReferenceError(`Missing 2nd argument, expected an object`)
    } else if (typeName(creditors) !== 'Array') {
      err = new TypeError(`Wrong type for 1st argument, expected an array, found type '${typeName(creditors)}'`)
    } else if (typeName(schemas) !== 'Object') {
      err = new TypeError(`Wrong type for 2nd argument, expected an object, found type '${typeName(schemas)}'`)
    }
    if (!err) {
      tasks = creditors
        .map((creditor) => {
          const returned = kasper.validate(schemas.creditor, creditor)
          if (returned.result == null) {
            err = new ValidationError(`Invalid configuration of creditor`)
            err.subject = creditor
            err.kasper = returned.err.message
            throw err
          }
          switch (creditor.scraper.name) {
            case SCRAPER_STATIC_TABLE:
              return {
                attemptNo: 1,
                maxAttempts: creditor.maxAttempts || null,
                creditor: creditor.name,
                scraper: scrapers[creditor.scraper.name],
                requestFunction: requestPromiseNative,
                isAsyncScraper: creditor.scraper.async,
                scraperName: creditor.scraper.name,
                payload: creditor.payload,
                targetURL: creditor.targetURL,
                schemaName: creditor.bsonDocSchema,
                hdSelector: creditor.scraper.hdSelector,
                trSelector: creditor.scraper.trSelector,
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
