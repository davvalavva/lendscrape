/**
 * TODO Short description
 *
 * @module helpers/validateMongoDocVal
 */

const { ValidationError } = require('./customErrors')
const typeMappings = require('../config/docToJSTypeMappings.json')

/**
 * TODO Detailed description
 *
 * @param {string} key TODO description
 * @param {mixed} value TODO description
 * @param {object} schema TODO description
 * @return {boolean} Returns true if validation succeeds, otherwise an error is thrown
 */
module.exports = (key, value, schema) => {
  if (key == null || value == null || schema == null) {
    throw new ReferenceError('undefined or null not allowed as arguments')
  }
  if (typeof key !== 'string') {
    throw new TypeError('Invalid type in first argument')
  }
  if (key.trim() === '') {
    throw new ValidationError('Empty string is not allowed as first argument')
  }
  if (schema && schema[key] === undefined) {
    throw new ValidationError('Given key in first argument doesn\'t exist in given schema given as third argument')
  }
  const docType = schema[key].type
  const mapped = typeMappings[docType]
  const JSTypeExpected = mapped.JStype
  if (typeof value !== JSTypeExpected) { // eslint-disable-line
    throw new TypeError('Invalid type in second argument')
  }
  if (mapped.regex) {
    const r = new RegExp(mapped.regex)
    if (!r.test(value)) {
      throw new ValidationError('Wrong format of string value given in second argument')
    }
  }
  return true
}
