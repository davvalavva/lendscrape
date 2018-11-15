const requestPromise = require('request-promise')
const cheerio = require('cheerio')
const path = require('path')
const typeName = require('type-name')
const ValidationError = require('../errors/validation-error')
const parseNum = require('./parse-number')
const tableToDocs = require('./table-to-docs')
const labelsChanged = require('./labels-changed')
const validateDoc = require('./validate-document')
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

module.exports = async (options, cfg) => {
  // return Promise.reject(1)
  // for debugging and testing, overrides 'runtime.json' settings
  const debug = cfg && typeName(cfg.debug) === 'number'
    ? cfg.debug
    : debugMode // 0 = no debug, 1 = normal, 2 = testing
  const log = cfg && typeName(cfg.log) === 'boolean'
    ? cfg.log
    : enableLogging // boolean
  const rp = cfg && typeName(cfg.rp) === 'function'
    ? cfg.rp
    : requestPromise

  let docs
  try {
    let err
    let headers
    let rowsStr
    let targetURL
    let hdSelector
    let tdSelector
    let schema
    let labelMap
    let fieldInject

    if (options === undefined) {
      err = new ReferenceError(`Missing argument, expected an object as argument`)
    } else if (typeName(options) !== 'Object') {
      err = new TypeError(`Expected an object as the argument`)
    } else if (options.targetURL === undefined) {
      err = new ReferenceError(`Missing property 'targetURL' in object passed to function.`)
    } else if (options.hdSelector === undefined) {
      err = new ReferenceError(`Missing property 'hdSelector' in object passed to function.`)
    } else if (options.tdSelector === undefined) {
      err = new ReferenceError(`Missing property 'tdSelector' in object passed to function.`)
    } else if (options.schema === undefined) {
      err = new ReferenceError(`Missing property 'schema' in object passed to function.`)
    } else if (options.labelMap === undefined) {
      err = new ReferenceError(`Missing property 'labelMap' in object passed to function.`)
    } else if (typeName(options.targetURL) !== 'string') {
      err = new TypeError(`Expected property 'targetURL' in passed object to be a string. Found type '${typeName(options.targetURL)}'.`)
    } else if (typeName(options.hdSelector) !== 'string') {
      err = new TypeError(`Expected property 'hdSelector' in passed object to be a string. Found type '${typeName(options.hdSelector)}'.`)
    } else if (typeName(options.tdSelector) !== 'string') {
      err = new TypeError(`Expected property 'tdSelector' in passed object to be a string. Found type '${typeName(options.tdSelector)}'.`)
    } else if (typeName(options.schema) !== 'Object') {
      err = new TypeError(`Expected property 'schema' in passed object to be an object. Found type '${typeName(options.schema)}'.`)
    } else if (typeName(options.labelMap) !== 'Array') {
      err = new TypeError(`Expected property 'labelMap' in passed object to be an array. Found type '${typeName(options.labelMap)}'.`)
    } else if (options.fieldInject !== undefined && typeName(options.fieldInject) !== 'Object') {
      err = new TypeError(`Expected property 'fieldInject' in passed object to be an object. Found type '${typeName(options.fieldInject)}'.`)
    }
    if (!err) {
      ({
        targetURL, hdSelector, tdSelector, schema, labelMap, fieldInject = {}
      } = options)
    }
    if (!err) {
      const html = await rp({ uri: targetURL })
      const $ = cheerio.load(html)
      const elementContent = el => $(el).text()
      const toStringsArray = nodes => nodes
        .toArray()
        .map(elementContent)
      headers = toStringsArray($(hdSelector))
      rowsStr = $(tdSelector)
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
      docs = docsPartial.map(document => ({ ...document, ...fieldInject }))

      // validate objects
      docs.forEach(document => validateDoc(document, schema))
    }
    if (err) {
      err.signature = 'function(options)'
      err.args = [
        {
          position: 0, required: true, expectedType: 'Object', foundType: typeName(options), foundValue: options
        }
      ]
      err.path = filepath
      throw err
    }
  } catch (e) {
    e.path = filepath
    if (debug === 1) printError(e)
    if (log) logError(e)
    throw e
  }
  return docs
}
