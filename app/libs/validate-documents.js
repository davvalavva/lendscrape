/**
 * @file Validates documents to be stored in database
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

/**
 * Validates that documents conforms to a set of rules
 * according to a schema passed as the second argument
 *
 * @module helpers/validate-documents
 */

const path = require('path')
const typeName = require('type-name')
const ValidationError = require('../errors/validation-error')
const XTypeError = require('../errors/xtype-error')
const validateKeyVal = require('./validate-key-val')
const env = require('../config/env.json')

const filename = env.OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)

/**
 * Validates that documents conforms to a set of rules according to
 * a schema that is passed as the second argument. If a document breaks
 * any rule, for example missing a mandatory key/value pair, an error is thrown.
 *
 * @param {object[]} documents The document object to be validated
 * @param {object} schema The schema with rules to test the document object against
 * @return {boolean} Returns true if validation succeeds, otherwise an error is thrown
 */
module.exports = (documents, schema) => {
  if (typeName(documents) !== 'Array') {
    throw new XTypeError(300, `Expected an array as first argument`, filename, 'Array', typeName(documents))
  }
  if (typeName(schema) !== 'Object') {
    throw new XTypeError(300, `Expected an object as second argument`, filename, 'Object', typeName(schema))
  }
  const requiredKeys = Object.keys(schema)
    .map(keyStr => ({ name: keyStr, ...schema[keyStr] }))
    .filter(obj => obj.required)

  documents.forEach((doc) => {
    requiredKeys.forEach((obj) => {
      if (doc[obj.name] == null) {
        throw new ValidationError(`Required key "${obj.name}" is missing in document object`, filename)
      }
    })
    Object.keys(doc).forEach(key => validateKeyVal(key, doc[key], schema))
  })

  return true
}
