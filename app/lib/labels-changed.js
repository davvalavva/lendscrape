/** @module lib/labels-changed */

const typeName = require('type-name')
const jsonPointer = require('json-pointer')
const hasErrors = require('./has-validation-errors')
const ValidationError = require('../errors/validation-error')
const { printError, logError, filepath, debugMode, enableLogging } = require('../helpers/common-debug-tools.js') // eslint-disable-line
const argsSchema = require('./labels-changed-args.json')

const labelSchema = jsonPointer.get(argsSchema, '/definitions/labelSchema')
const labelMapSchema = jsonPointer.get(argsSchema, '/definitions/labelMapSchema')

const debug = debugMode
const log = enableLogging

/**
 * Checks that strings matches expected values given in the object map passed
 * as second argument.
 *
 * @param {string[]} labels The labels scraped from the web page
 * @param {object[]} labelMap An array with objects mapping headernames from web page
 * to corresponding keynames for the documents in database
 * @return {boolean} Returns true if labels have changed, false otherwise
 */
module.exports = (labels, labelMap) => {
  try {
    if (typeName(labels) !== 'Array' || typeName(labelMap) !== 'Array') {
      throw TypeError(`Expected two arrays as arguments, found type '${typeName(labels)}' and '${typeName(labelMap)}'`)
    }
    let invalid = hasErrors(labelSchema, labels)
    if (invalid) {
      const err = new ValidationError(`Unexpected content of array given in first argument`)
      err.ajv = invalid
      throw err
    }
    invalid = hasErrors(labelMapSchema, labelMap)
    if (invalid) {
      const err = new ValidationError(`Unexpected content of array given in second argument`)
      err.ajv = invalid
      throw err
    }

    const clean = str => str.trim().toLowerCase()
    if (labels.length !== labelMap.length) {
      return true
    }
    if (!labelMap.every(
      (item, i) => clean(item.label) === clean(labels[i])
    )) {
      return true
    }
  //
  } catch (e) {
    e.path = filepath(__filename)
    if (debug === 1) printError(e)
    if (log) logError(e)
    throw e
  }
  return false
}
