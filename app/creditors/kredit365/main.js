const rp = require('request-promise')
const cheerio = require('cheerio')
const path = require('path')
const ValidationError = require('../../errors/validation-error')
const parseNum = require('../../libs/parse-number')
const tableToDocs = require('../../libs/table-to-docs')
const labelsChanged = require('../../libs/labels-changed')
const validateDoc = require('../../libs/validate-document')
const schema = require('../../schema/payday-simple-1.json')
const labelMap = require('./label-map.json')
const fieldInject = require('./field-inject.json')
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

const PARSE_TARGET_URL = 'http://localhost:3000'
const options = {
  uri: PARSE_TARGET_URL, transform: body => cheerio.load(body)
}; // semicolon required because of ASI

(async () => {
  const $ = await rp(options)
  const elementContent = el => $(el).text()
  const toStringsArray = nodes => nodes.toArray().map(elementContent)
  const thList = $('.content > article > table > thead > tr > th')
  const headers = toStringsArray(thList)
  const strRows = $('.content > article > table > tbody > tr').toArray()
    .map(trArr => toStringsArray($(trArr).children('td')))

  if (labelsChanged(headers, labelMap)) throw new ValidationError('Unexpected header(s) in page')

  // strings to numbers
  const rows = strRows
    .map(row => row
      .map(strVal => parseNum(strVal)))

  // array of arrays to array of objects (BSON documents)
  const docsPartial = tableToDocs({ rows, labelMap })

  // inject manual fields into every object
  const docs = docsPartial.map(document => ({ ...document, ...fieldInject }))

  // validate objects
  docs.forEach(document => validateDoc(document, schema))

  console.log(JSON.stringify(docs, null, 2))
})()
  .catch((e) => {
    if (debug) {
      if (debug === 1) printError(e)
      if (log) logError(e)
    }
    const err = new Error(e.message)
    err.path = filepath
    throw err
  })
