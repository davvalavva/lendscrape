const creditorsConfig = require('./config/creditors.json')
const tableScraper = require('./libs/table-scraper')

const creditors = creditorsConfig.filter(creditor => creditor.parse);

(async () => {
  const tasks = creditors
    .map((creditor) => {
      if (creditor.scraper.type === 'static-table') {
        return {
          scraper: tableScraper,
          targetURL: creditor.targetURL,
          hdSelector: creditor.scraper.hdSelector,
          tdSelector: creditor.scraper.tdSelector,
          labelMap: creditor.labelMap,
          fieldInject: creditor.fieldInject || null
        }
      }
      // return parseTasks[creditor.name]()
      throw new Error('Not implemented!')
    })

  // In contrast to using Promise.all(), a for...of loop over an array of promises doesn't
  // require all promises to be resolved to be able to retrieve any data from the scrapings.
  // This is a huge deal. And another great benefit is that rejected promises can easily be
  // tried again without needing to redo every operation, including successful ones, again.
  let documents = []
  for (const task of tasks) {
    documents = [...documents, ...await task.scraper(task)] // eslint-disable-line no-await-in-loop
  }
  console.log(documents)
})()
