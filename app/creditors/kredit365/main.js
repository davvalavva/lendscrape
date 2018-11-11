const path = require('path')
const parseNum = require('../../libs/parse-number')
const { newPage, closeBrowser } = require('../../libs/browser-manager')
const tableToDocs = require('../../libs/table-to-docs')
const tableHeadersChanged = require('./table-headers-changed')
const validateDoc = require('../../libs/validate-document')
const schema = require('../../schema/payday-simple-1.json')
const keyMap = require('./key-map.json')
const fieldInclusions = require('./field-inclusions.json')
const printError = require('../../errors/print-error')
const logError = require('../../libs/log-error')
const {
  OS,
  projectRoot
} = require('../../config/env.json')
const {
  debugMode,
  enableLogging
} = require('../../config/runtime.json')

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${projectRoot}${fName}`

// override config in 'runtime.json'
const debug = debugMode // 0 = no debug, 1 = normal, 2 = testing
const log = enableLogging // true|false

const PARSE_TARGET_URL = 'http://localhost:3000/'

const scrape = async () => {
  const page = await newPage()
  await page.goto(PARSE_TARGET_URL, { waitUntil: 'networkidle2', timeout: 20000 })
  await page.waitForSelector('.content > article > table')

  // scrape HTML table headers into an array of strings
  const headers = await page.evaluate(() => {
    const thNodeList = document.querySelectorAll('.content > article > table > thead > tr > th')
    const thNodes = Array.from(thNodeList)
    return thNodes.map(element => element.innerText)
  })

  // extract HTML table rows data into an array (becomes array of arrays)
  const strRows = await page.evaluate(() => {
    const rowsArr = []
    document.querySelectorAll('.content > article > table > tbody > tr').forEach((trNode, i) => {
      rowsArr[i] = []
      trNode.childNodes.forEach((tdNode) => {
        if (tdNode.nodeType === 1) {
          rowsArr[i].push(tdNode.innerText)
        }
      })
    })
    return rowsArr
  })

  await closeBrowser()

  // make sure headers haven't been changed
  if (tableHeadersChanged(headers, keyMap)) {
    throw new Error('Unexpected header(s) in page')
  }

  // convert array of arrays with numeric strings into array of arrays with Numbers
  const rows = strRows
    .map(row => row
      .map(strVal => parseNum(strVal)))

  // transform array of arrays into array of objects (i.e. into BSON documents)
  const docs = tableToDocs({ rows, keyMap })

  return docs
    // insert manually included fields into every document
    .map(document => ({ ...document, ...fieldInclusions }))
}

module.exports = () => {
  scrape()
    .then((documents) => {
      documents.forEach(document => validateDoc(document, schema))
      console.log(JSON.stringify(documents, null, 2))
      // TODO: Serialize and store data
    })
    .catch((e) => {
      e.path = filepath
      if (debug) {
        if (debug === 1) printError(e)
        if (log) logError(e)
      }
      throw e
    })
}
