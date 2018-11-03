/**
 * @file Validates keys and values from documents
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

/**
 * Validates key/value pairs in a document
 *
 * @module helpers/validate-key-val
 */

const path = require('path')
const typeName = require('type-name')
const { ValidationError } = require('../config/custom-errors')
const printError = require('./print-error')
const map = require('../config/BSON-to-JS-mappings.json')
const env = require('../config/env.json')
const runtime = require('../config/runtime.json')

const filename = env.OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const { debug } = runtime

/**
 * Validates that key/value pairs in a document conforms to
 * the schema passed as the third argument.
 *
 * @param {string} key The key of the key/value pair to be tested
 * @param {mixed} value The value of the key/value pair to be tested
 * @param {object} schema The schema with rules to test against
 * @return {boolean} Returns true if validation succeeds, otherwise an error is thrown
 */
module.exports = (key, value, schema) => {
  try {
    if (key == null || value == null || schema == null) {
      throw new TypeError('undefined or null not allowed as arguments')
    }
    if (typeName(key) !== 'string') {
      throw new TypeError(`Expected first argument to be a string, found type '${typeName(key)}'`)
    }
    if (key.trim() === '') {
      throw new ValidationError(101, 'Invalid key', filename, { key })
    }
    if (!schema[key] || schema[key] == null || schema[key] === 0 || schema[key] === '') {
      throw new ValidationError(100, 'Invalid key', filename, { key })
    }
    const expectedType = map[schema[key]['BSON-type']].JStype
    if (typeof value !== expectedType) { // eslint-disable-line
      throw new TypeError('Invalid type in second argument', 'validate-key-val.js', 42)
    }
  } catch (e) {
    if (e instanceof ValidationError) {
      let reason
      if (e.code === 100) reason = `Reason: Non-existing key '${e.scope.key}' in schema`
      if (e.code === 101) reason = `Reason: Key is empty string`

      if (debug) {
        printError({
          name: e.name,
          code: e.code,
          message: e.message,
          fileName: e.fileName,
          reason
        })
      }
    } else if (e instanceof TypeError) {
      console.log('******************************************************************************************************************\n')
      console.log(`${e.name}:::: ${e.message}\n`)
      console.log('******************************************************************************************************************\n')
    }
    throw e
  }
  return true
}
