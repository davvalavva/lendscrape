const requestPromiseNative = require('request-promise-native')
const cheerio = require('cheerio')
const typeName = require('type-name')
const {
  printError, logError, filepath, debugMode, enableLogging
} = require('../helpers/common-debug-tools.js')
const ValidationError = require('../errors/validation-error')
const StatusCodeError = require('../errors/status-code-error')
const parseNum = require('../lib/parse-number')
const tableToDocs = require('../lib/table-to-docs')
const labelsChanged = require('../lib/labels-changed')
const validateDoc = require('../lib/validate-document')

// for debugging and testing, overrides 'runtime.json' settings
const debug = debugMode // 0 = no debug, 1 = normal, 2 = testing
const log = enableLogging // boolean

module.exports = async (task, request = requestPromiseNative) => {
  let documents
  let response
  try {
    let err
    let headers
    let rowsStr
    let targetURL
    let hdSelector
    let trSelector
    let schema
    let labelMap
    let fieldInject

    if (task === undefined) {
      err = new ReferenceError(`Missing argument, expected an object as argument`)
    } else if (typeName(task) !== 'Object') {
      err = new TypeError(`Expected an object as the argument`)
    } else if (task.targetURL === undefined) {
      err = new ReferenceError(`Missing property 'targetURL' in object passed to function.`)
    } else if (task.hdSelector === undefined) {
      err = new ReferenceError(`Missing property 'hdSelector' in object passed to function.`)
    } else if (task.trSelector === undefined) {
      err = new ReferenceError(`Missing property 'trSelector' in object passed to function.`)
    } else if (task.schema === undefined) {
      err = new ReferenceError(`Missing property 'schema' in object passed to function.`)
    } else if (task.labelMap === undefined) {
      err = new ReferenceError(`Missing property 'labelMap' in object passed to function.`)
    } else if (typeName(task.targetURL) !== 'string') {
      err = new TypeError(`Expected property 'targetURL' in passed object to be a string. Found type '${typeName(task.targetURL)}'.`)
    } else if (typeName(task.hdSelector) !== 'string') {
      err = new TypeError(`Expected property 'hdSelector' in passed object to be a string. Found type '${typeName(task.hdSelector)}'.`)
    } else if (typeName(task.trSelector) !== 'string') {
      err = new TypeError(`Expected property 'trSelector' in passed object to be a string. Found type '${typeName(task.trSelector)}'.`)
    } else if (typeName(task.schema) !== 'Object') {
      err = new TypeError(`Expected property 'schema' in passed object to be an object. Found type '${typeName(task.schema)}'.`)
    } else if (typeName(task.labelMap) !== 'Array') {
      err = new TypeError(`Expected property 'labelMap' in passed object to be an array. Found type '${typeName(task.labelMap)}'.`)
    } else if (task.fieldInject !== undefined && typeName(task.fieldInject) !== 'Object') {
      err = new TypeError(`Expected property 'fieldInject' in passed object to be an object. Found type '${typeName(task.fieldInject)}'.`)
    }
    if (!err) {
      ({
        targetURL, hdSelector, trSelector, schema, labelMap, fieldInject = {}
      } = task)
    }
    if (!err) {
      request.debug = debug === 1 // note: works only when real request, not stub
      const options = {
        uri: targetURL,
        simple: false,
        resolveWithFullResponse: true
      }
      response = await request(options)

      if (!(/^2/.test(response.statusCode.toString()))) { // Status Codes other than 2xx
        err = new StatusCodeError(`A HTTP ${response.statusCode} response was returned from the request`)
        err.response = response
        throw err
      }
      const $ = cheerio.load(response.body)
      const elementContent = el => $(el).text()
      const toStringsArray = nodes => nodes
        .toArray()
        .map(elementContent)
      headers = toStringsArray($(hdSelector))
      rowsStr = $(trSelector)
        .toArray()
        .map(trArr => toStringsArray($(trArr).children('td')))

      if (labelsChanged(headers, labelMap)) {
        err = new ValidationError(`Couldn't map all headers given to a corresponding field using map found in 'labelMap' property.`)
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
      documents = docsPartial.map(document => ({ ...document, ...fieldInject }))

      // validate objects
      documents.forEach(document => validateDoc(document, schema))
    }
    if (err) {
      err.signature = 'function(task)'
      err.args = [
        {
          position: 0, required: true, expectedType: 'Object', foundType: typeName(task), foundValue: task
        }
      ]
      throw err
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
