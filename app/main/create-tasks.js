const { TABLE_SCRAPER } = require('./constants.js')
const scrapers = require('../scrapers')

module.exports = (creditors, tryAgain) => {
  if (tryAgain.length > 0) return [...tryAgain]

  return creditors
    .map((creditor) => {
      switch (creditor.scraper.name) {
        case TABLE_SCRAPER:
          return {
            attemptNo: 1,
            maxRetries: creditor.maxRetries || null,
            creditor: creditor.name,
            scraper: scrapers[creditor.scraper.name],
            isAsyncScraper: creditor.scraper.async,
            scraperName: creditor.scraper.name,
            payload: creditor.payload,
            targetURL: creditor.targetURL,
            schema: creditor.schema,
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
