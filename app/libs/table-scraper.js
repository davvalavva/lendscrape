const rp = require('request-promise')
const cheerio = require('cheerio')
const path = require('path')
const ValidationError = require('../errors/validation-error')
const parseNum = require('./parse-number')
const tableToDocs = require('./table-to-docs')
const labelsChanged = require('./labels-changed')
const validateDoc = require('./validate-document')
const schema = require('../schema/payday-simple-1.json')
const printError = require('../errors/print-error')
const logError = require('./log-error')
const {
  OS,
  projectRoot
} = require('../config/env.json')
const {
  debugMode,
  enableLogging
} = require('../config/runtime.json')

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${projectRoot}${fName}`

// override config in 'runtime.json'
const debug = debugMode // 0 = no debug, 1 = normal, 2 = testing
const log = enableLogging // true|false

module.exports = async (options) => {
  let docs
  try {
    let err
    let headers
    let rowsStr
    const {
      targetURL, hdSelector, tdSelector, labelMap, fieldInject
    } = options

    if (!err) {
      const cheerioOptions = { uri: targetURL, transform: body => cheerio.load(body) }
      const $ = await rp(cheerioOptions)
      const elementContent = el => $(el).text()
      const toStringsArray = nodes => nodes
        .toArray()
        .map(elementContent)
      headers = toStringsArray($(hdSelector))
      rowsStr = $(tdSelector)
        .toArray()
        .map(trArr => toStringsArray($(trArr).children('td')))

      if (labelsChanged(headers, labelMap)) {
        err = new ValidationError('Unexpected header(s) in page')
      }
    }
    if (!err) {
      // strings to numbers
      const rows = rowsStr
        .map(row => row
          .map(strVal => parseNum(strVal)))

      // array of arrays to array of objects (BSON documents)
      const docsPartial = tableToDocs({ rows, labelMap })

      // inject manual fields into every object
      docs = docsPartial.map(document => ({ ...document, ...fieldInject }))

      // validate objects
      docs.forEach(document => validateDoc(document, schema))
    }
  } catch (e) {
    if (debug) {
      if (debug === 1) printError(e)
      if (log) logError(e)
    }
    const err = new Error(e.message)
    err.path = filepath
    throw err
  }
  return docs
}
