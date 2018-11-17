const kasper = require('kasper')
const {
  SCRAPER_STATIC_TABLE,
  SCHEMA_PAYDAY_SIMPLE_1
} = require('./constants.js')
const ValidationError = require('../errors/validation-error')
const scrapers = require('../scrapers')
const schemas = require('../schemas')

module.exports = (creditors) => {
  if (creditors === undefined) {
    throw new Error()
  }
  return creditors
    .map((creditor) => {
      const validationResult = kasper.validate(schemas.creditor, creditor)
      if (validationResult.err) {
        const err = new ValidationError(`Invalid configuration of creditor`)
        err.errorSubject = creditor
        err.kasper = validationResult
        throw err
      }
      switch (creditor.scraper.name) {
        case SCRAPER_STATIC_TABLE:
          return {
            attemptNo: 1,
            maxRetries: creditor.maxRetries || null,
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
