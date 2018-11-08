/**
 * Validates key/value pairs in a document
 *
 * @module libs/validate-key-val
 */

const path = require('path')
const typeName = require('type-name')
const ValidationError = require('../errors/validation-error')
const map = require('../schema/BSON-JS-map.json')
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
    throw new TypeError(`Expected a string as first argument`)
  }
  if (typeName(schema) !== 'Object') {
    throw new TypeError(`Expected an object as third argument`)
  }
  if (['string', 'number', 'Array'].indexOf(typeName(value)) === -1) {
    throw new TypeError(`Expected a string, number or an array as second argument`)
  }
  if (key.trim() === '') {
    throw new ValidationError('Invalid key')
  }
  if (!schema[key] || schema[key] == null || schema[key] === 0 || schema[key] === '') {
    throw new ValidationError('Invalid key')
  }
  const expectedType = map[schema[key]['BSON-type']]
  if (typeName(value) !== expectedType) {
    throw new TypeError('Invalid type in second argument')
  }
  return true
}
