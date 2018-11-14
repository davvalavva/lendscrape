const tableScraper = require('../lib/table-scraper')

const TABLE_SCRAPER = 'table-scraper'

module.exports = (creditors, tryAgain) => {
  const tasks = tryAgain.length > 0
    ? [...tryAgain]
    : creditors
      .map((creditor) => {
        if (creditor.scraper.name === TABLE_SCRAPER) {
          return {
            attemptNo: 1,
            maxRetries: creditor.maxRetries,
            creditor: creditor.name,
            scraper: tableScraper,
            asyncScraper: creditor.scraper.async,
            scraperName: creditor.scraper.name,
            payload: creditor.payload,
            targetURL: creditor.targetURL,
            schema: creditor.schema,
            hdSelector: creditor.scraper.hdSelector,
            tdSelector: creditor.scraper.tdSelector,
            labelMap: creditor.labelMap,
            fieldInject: creditor.fieldInject || null
          }
        }
        throw new Error('Not implemented!')
      })

  return tasks
}
