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
const { ValidationError } = require('../config/custom-errors')
const map = require('../config/BSON-to-JS-mappings.json')

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
      throw new ReferenceError('undefined or null not allowed as arguments')
    }
    if (typeof key !== 'string') {
      throw new TypeError('Invalid type in first argument')
    }
    if (key.trim() === '') {
      throw new ValidationError(100, 'Empty string is not allowed as first argument', path.win32.basename(__filename))
    }
    if (schema && schema[key] === undefined) {
      throw new ValidationError(100, 'Given key in first argument doesn\'t exist in given schema given as third argument', path.win32.basename(__filename), { key })
    }
    const expectedType = map[schema[key]['BSON-type']].JStype
    if (typeof value !== expectedType) { // eslint-disable-line
      throw new TypeError('Invalid type in second argument', 'validate-key-val.js', 42)
    }
  } catch (e) {
    if (e instanceof ValidationError) {
      console.log('******************************************************************************************************************\n')
      console.log(`${e.name}: ${e.message}\n`)
      console.log(`keyName: ${e.scope.key}\n`)
      console.log(`Filename: ${e.fileName}\n`)
      console.log('******************************************************************************************************************\n')
    } else if (e instanceof TypeError) {
      console.log('******************************************************************************************************************\n')
      console.log(`${e.name}:::: ${e.message}\n`)
      console.log('******************************************************************************************************************\n')
    }
    throw e
  }
  return true
}
