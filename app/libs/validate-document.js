/**
 * Validates that documents conforms to a set of rules
 * according to a schema passed as the second argument
 *
 * @module libs/validate-document
 */

const typeName = require('type-name')
const ValidationError = require('../errors/validation-error')
const validateField = require('./validate-field')

/**
 * Validates that a document conforms to a set of rules according to
 * a schema that is passed as the second argument. If the document breaks
 * any rule, for example missing a mandatory key/value pair, an error is thrown.
 *
 * @param {object[]} document The document object to be validated
 * @param {object} schema The schema with rules to test the document object against
 * @return {boolean} Returns true if validation succeeds, otherwise an error is thrown
 */
module.exports = (document, schema) => {
  if (typeName(schema) !== 'Object') {
    throw new TypeError(`Expected an object as second argument`)
  }
  const requiredKeys = Object.keys(schema)
    .map(keyStr => ({ name: keyStr, ...schema[keyStr] }))
    .filter(obj => obj.required)

  requiredKeys.forEach((obj) => {
    if (document[obj.name] == null) {
      throw new ValidationError(`Required key "${obj.name}" is missing in document object`)
    }
  })
  Object.keys(document).forEach(key => validateField(key, document[key], schema))

  return true
}
