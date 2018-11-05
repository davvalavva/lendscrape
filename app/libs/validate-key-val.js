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
const ValidationError = require('../errors/validation-error')
const XTypeError = require('../errors/xtype-error')
const map = require('../config/BSON-to-JS-mappings.json')
const env = require('../config/env.json')

const filename = env.OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)

/**
 * Validates that key/value pairs in a document conforms to
 * the schema passed as the third argument.
 *
 * @param {string} key The key of the key/value pair to be tested
 * @param {string|number|array} value The value of the key/value pair to be tested
 * @param {object} schema The schema with rules to test against
 * @return {boolean} Returns true if validation succeeds, otherwise an error is thrown
 */
module.exports = (key, value, schema) => {
  if (typeName(key) !== 'string') {
    throw new XTypeError(300, `Expected a string as first argument`, filename, 'string', typeName(key))
  }
  if (typeName(schema) !== 'Object') {
    throw new XTypeError(300, `Expected an object as third argument`, filename, 'Object', typeName(schema))
  }
  if (['string', 'number', 'Array'].indexOf(typeName(value)) === -1) {
    throw new XTypeError(300, `Expected a string, number or an array as second argument`, filename, ['string', 'number', 'Array'], typeName(value))
  }
  if (key.trim() === '') {
    throw new ValidationError('Invalid key', filename)
  }
  if (!schema[key] || schema[key] == null || schema[key] === 0 || schema[key] === '') {
    throw new ValidationError('Invalid key', filename)
  }
  const expectedType = map[schema[key]['BSON-type']].JStype
  if (typeName(value) !== expectedType) {
    throw new XTypeError(300, 'Invalid type in second argument', filename, expectedType, typeName(key))
  }
  return true
}
