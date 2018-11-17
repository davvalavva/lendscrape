const requestPromise = require('request-promise')
const cheerio = require('cheerio')
const path = require('path')
const typeName = require('type-name')
const ValidationError = require('../errors/validation-error')
const parseNum = require('../lib/parse-number')
const tableToDocs = require('../lib/table-to-docs')
const labelsChanged = require('../lib/labels-changed')
const validateDoc = require('../lib/validate-document')
const printError = require('../errors/print-error')
const logError = require('../lib/log-error')
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

module.exports = async (task, cfg) => {
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

    if (task === undefined) {
      err = new ReferenceError(`Missing argument, expected an object as argument`)
    } else if (typeName(task) !== 'Object') {
      err = new TypeError(`Expected an object as the argument`)
    } else if (task.targetURL === undefined) {
      err = new ReferenceError(`Missing property 'targetURL' in object passed to function.`)
    } else if (task.hdSelector === undefined) {
      err = new ReferenceError(`Missing property 'hdSelector' in object passed to function.`)
    } else if (task.tdSelector === undefined) {
      err = new ReferenceError(`Missing property 'tdSelector' in object passed to function.`)
    } else if (task.schema === undefined) {
      err = new ReferenceError(`Missing property 'schema' in object passed to function.`)
    } else if (task.labelMap === undefined) {
      err = new ReferenceError(`Missing property 'labelMap' in object passed to function.`)
    } else if (typeName(task.targetURL) !== 'string') {
      err = new TypeError(`Expected property 'targetURL' in passed object to be a string. Found type '${typeName(task.targetURL)}'.`)
    } else if (typeName(task.hdSelector) !== 'string') {
      err = new TypeError(`Expected property 'hdSelector' in passed object to be a string. Found type '${typeName(task.hdSelector)}'.`)
    } else if (typeName(task.tdSelector) !== 'string') {
      err = new TypeError(`Expected property 'tdSelector' in passed object to be a string. Found type '${typeName(task.tdSelector)}'.`)
    } else if (typeName(task.schema) !== 'Object') {
      err = new TypeError(`Expected property 'schema' in passed object to be an object. Found type '${typeName(task.schema)}'.`)
    } else if (typeName(task.labelMap) !== 'Array') {
      err = new TypeError(`Expected property 'labelMap' in passed object to be an array. Found type '${typeName(task.labelMap)}'.`)
    } else if (task.fieldInject !== undefined && typeName(task.fieldInject) !== 'Object') {
      err = new TypeError(`Expected property 'fieldInject' in passed object to be an object. Found type '${typeName(task.fieldInject)}'.`)
    }
    if (!err) {
      ({
        targetURL, hdSelector, tdSelector, schema, labelMap, fieldInject = {}
      } = task)
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
      err.signature = 'function(task)'
      err.args = [
        {
          position: 0, required: true, expectedType: 'Object', foundType: typeName(task), foundValue: task
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
