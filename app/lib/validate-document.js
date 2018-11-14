/** @module lib/validate-document */

/* eslint-disable max-len */
/**
 * @function
 * Validates that the document (object) passed to the function has all the required
 * fields of a document following the rules of the passed schema. It also
 * checks each field (property) that each given fields exists in the schema and that
 * every field adheres to rules for allowed value types.
 *
 * PARAMETERS:
 * in order   Type          Name      Required  Description
 * ======================================================================================================
 * @param     {Object[]}    document  yes       The object to be validated
 *
 * @param     {Object}      schema    yes       The schema with rules to test the document object against
 *
 * RETURNS:
 * @return {Boolean} Returns true if validation succeeds, otherwise an error is thrown
 */
/* eslint-enable max-len */

const path = require('path')
const typeName = require('type-name')
const ValidationError = require('../errors/validation-error')
const validateField = require('./validate-field')
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

const requiredKeys = schema => Object.keys(schema)
  .map(keyStr => ({ name: keyStr, ...schema[keyStr] }))
  .filter(obj => obj.required)

module.exports = (document, schema, cfg) => {
  // for debugging and testing, overrides 'runtime.json' settings
  const debug = cfg && typeName(cfg.debug) === 'number'
    ? cfg.debug
    : debugMode // 0 = no debug, 1 = normal, 2 = testing
  const log = cfg && typeName(cfg.log) === 'boolean'
    ? cfg.log
    : enableLogging // boolean

  try {
    let err
    if (document === undefined) {
      err = new ReferenceError(`Missing 1st argument 'document', expected an object.`)
    } else if (typeName(document) !== 'Object') {
      err = new TypeError(`Expected an object as 1st argument, found type '${typeName(document)}'`)
    } else if (schema === undefined) {
      err = new ReferenceError(`Missing 2nd argument 'schema', expected an object.`)
    } else if (typeName(schema) !== 'Object') {
      err = new TypeError(`Expected an object as 2nd argument, found type '${typeName(schema)}'`)
    }
    if (!err) {
      requiredKeys(schema).forEach((obj) => {
        if (document[obj.name] == null) {
          err = new ValidationError(`Missing required property "${obj.name}" in object passed as first argument`)
        }
      })
      if (!err) {
        Object.keys(document).forEach(key => validateField(key, document[key], schema))
      }
    }
    if (err) {
      err.signature = 'function(document, schema)'
      err.args = [
        {
          position: 0, required: true, expectedType: 'Object', foundType: typeName(document), foundValue: document
        },
        {
          position: 1, required: true, expectedType: 'Object', foundType: typeName(schema), foundValue: schema
        }
      ]
      err.path = filepath
      throw err
    }
  } catch (e) {
    if (debug === 1) printError(e)
    if (log) logError(e)
    throw e
  }

  return true
}
