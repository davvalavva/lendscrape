const typeName = require('type-name')
const cheerio = require('cheerio')
const hasValidationErrors = require('../lib/has-validation-errors')
const { printError, logError, filepath, debugMode, enableLogging } = require('../helpers/common-debug-tools.js') // eslint-disable-line
const ValidationError = require('../errors/validation-error')
const StatusCodeError = require('../errors/status-code-error')
const parseNum = require('../lib/parse-number')
const tableToDocs = require('../lib/table-to-docs')
const labelsChanged = require('../lib/labels-changed')

const debug = debugMode
const log = enableLogging

module.exports = async (task) => {
  let documents
  let response
  try {
    const {
      request, targetURL, hdSelector, trSelector, documentSchema, labelMap, fieldInject = {}
    } = task || {}

    if (typeName(task) !== 'Object') {
      throw new TypeError(`Argument must be an object, found type '${typeName(task)}'`)
    }

    request.debug = debug === 1
    const options = {
      uri: targetURL,
      simple: false,
      resolveWithFullResponse: true
    }
    response = await request(options)

    if (!(/^2/.test(response.statusCode.toString()))) { // status codes other than 2xx
      const err = new StatusCodeError(`A HTTP ${response.statusCode} response was returned from the request`)
      err.response = response
      throw err
    }

    // Extract data now loaded from webpage
    const $ = cheerio.load(response.body)
    const elementContent = el => $(el).text()
    const toStringsArray = nodes => nodes.toArray().map(elementContent)
    const headers = toStringsArray($(hdSelector))
    const rowsStr = $(trSelector).toArray().map(trArr => toStringsArray($(trArr).children('td')))

    // headers changed on webpage?
    if (labelsChanged(headers, labelMap)) {
      throw new ValidationError(`Couldn't map all headers given to a corresponding field using map found in 'labelMap' property.`)
    }

    // strings to numbers
    const rows = rowsStr.map(row => row.map(strVal => parseNum(strVal)))

    // array of arrays becomes array of objects (bson documents)
    const docsPartial = tableToDocs({ rows, labelMap })

    // merge manual (not parsed) fields into every document
    documents = docsPartial.map(document => ({ ...document, ...fieldInject }))

    // validate documents
    for (const document of documents) {
      const ajvErrors = hasValidationErrors(documentSchema, document)
      if (ajvErrors) {
        const err = new ValidationError(`Invalid document`)
        err.ajv = ajvErrors
        throw err
      }
    }
  } catch (e) {
    e.path = filepath(__filename)
    if (debug === 1) printError(e)
    if (log) logError(e)
    throw e
  }

  delete response.body
  return { documents, response }
}
