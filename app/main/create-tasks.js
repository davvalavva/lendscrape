const {
  SCRAPER_STATIC_TABLE,
  SCHEMA_PAYDAY_SIMPLE_1
} = require('./constants.js')
const scrapers = require('../scrapers')
const schemas = require('../schemas')

module.exports = (creditors, tryAgain) => {
  if (tryAgain.length > 0) return [...tryAgain]

  return creditors
    .map((creditor) => {
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
