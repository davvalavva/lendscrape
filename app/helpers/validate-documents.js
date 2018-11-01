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

const { ValidationError } = require('./custom-errors')

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
  if (documents == null || schema == null) {
    throw new ReferenceError('undefined or null not allowed as arguments')
  }
  if ((documents instanceof Array) === false) {
    throw new TypeError('Invalid type for first argument')
  }
  if (schema.constructor !== Object) {
    throw new TypeError('Invalid type for second argument')
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
  })
  return true
}
