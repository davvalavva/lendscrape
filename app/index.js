const creditorsConfig = require('./config/creditors.json')
const tableScraper = require('./libs/table-scraper')
/* eslint-disable-next-line */
// const someCreditorWithDiffParsingTechnique = require('./someCreditorWithDiffParsingTechnique/index')

async function parseStaticTable(options) {
  try {
    return await tableScraper(options)
  } catch (err) {
    throw err
  }
}

const parseTasks = { parseStaticTable /* , someCreditorWithDiffParsingTechnique */ }

const creditors = creditorsConfig.filter(creditor => creditor.parse)

const tasks = creditors
  .map((creditor) => {
    if (creditor.scraper.type === 'static-table') {
      return parseTasks.parseStaticTable({
        targetURL: creditor.targetURL,
        hdSelector: creditor.scraper.hdSelector,
        tdSelector: creditor.scraper.tdSelector,
        labelMap: creditor.labelMap,
        fieldInject: creditor.fieldInject || null
      })
    }
    return parseTasks[creditor.name]()
  })

Promise.all(tasks)
  .then(docsArrOfArr => docsArrOfArr.reduce((acc, curr) => [...acc, ...curr], []))
  .then(documents => console.log(documents))
