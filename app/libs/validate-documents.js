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
 * @module libs/validate-documents
 */

const typeName = require('type-name')
const ValidationError = require('../errors/validation-error')
const validateKeyVal = require('./validate-key-val')

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
    throw new TypeError(`Expected an array as first argument`)
  }
  if (typeName(schema) !== 'Object') {
    throw new TypeError(`Expected an object as second argument`)
  }
  const requiredKeys = Object.keys(schema)
    .map(keyStr => ({ name: keyStr, ...schema[keyStr] }))
    .filter(obj => obj.required)

  documents.forEach((doc) => {
    requiredKeys.forEach((obj) => {
      if (doc[obj.name] == null) {
        throw new ValidationError(`Required key "${obj.name}" is missing in document object`)
      }
    })
    Object.keys(doc).forEach(key => validateKeyVal(key, doc[key], schema))
  })

  return true
}
