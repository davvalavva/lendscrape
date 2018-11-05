/**
 * @file A type Error class. An Error class for customized errors.
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const typeName = require('type-name')
const errorCodes = require('./error-codes').map(arr => arr[0])

/**
 * A Custom Error class to be used when a variable or parameter is outside of its valid range.
 *
 * @extends Error
 */
class XRangeError extends Error {
  /**
   * Creates an XRangeError instance
   *
   * @param {number} code - The error code
   * @param {string} message - The error message
   * @param {string} fileName - The filename where the error is thrown
   * @param {string} type - The kind of range that applies for the error.
   * Allowed values are 'min', 'max', 'minmax' and 'enum'
   * @param {number|array} range - Specifies the allowed values, the range, that is allowed
   * but has not been adhered to by some variable or parameter, hence this Error is thrown.
   * The way it's specified depends on what value is passed to the type parameter.
   * When type parameter is set to either 'min' or 'max'
   * this is supposed to be a number with the min or max value that was expected.
   * When type parameter is set to 'minmax' the value is an array with two numbers where
   * the first value is the lowest allowed value and the second value is the highest allowed value.
   * When type parameter is set to 'enum' the value is an array of arbitry length with arbitrary
   * values of any type. Values in the array are the allowed values.
   */
  constructor(...args) {
    const [code, message, fileName, type, range] = args

    super(message)

    if (typeName(code) !== 'number') {
      throw new TypeError(`Expected first argument to be a number, found type '${typeName(code)}'`)
    }
    if (typeName(message) !== 'string') {
      throw new TypeError(`Expected second argument to be a string, found type '${typeName(message)}'`)
    }
    if (typeName(fileName) !== 'string') {
      throw new TypeError(`Expected third argument to be a string, found type '${typeName(fileName)}'`)
    }
    if (typeName(type) !== 'string') {
      throw new TypeError(`Expected 4th argument to be a string, found type '${typeName(type)}'`)
    }
    if (typeName(type) === 'string' && ['min', 'max', 'minmax', 'enum'].indexOf(type) === -1) {
      throw new TypeError(`Expected 4th argument to be one of following: 'min', 'max', 'minmax' or 'enum'. Instead found '${typeName(type)}'`)
    }
    if ((type === 'min' || type === 'max') && typeName(range) !== 'number') {
      throw new TypeError(`Expects 5th argument to be a number when 4th argument is set to '${type}'`)
    }
    if ((type === 'minmax' || type === 'enum') && typeName(range) !== 'Array') {
      throw new TypeError(`Expects 5th argument to be an array when 4th argument is set to '${type}'`)
    }
    if (typeName(range) !== 'number' && typeName(range) !== 'Array') {
      throw new TypeError(`Expected 5th argument to be a number or a string, found type '${typeName(range)}'`)
    }
    if (typeName(range) === 'Array' && range.length === 0) {
      throw new TypeError(`Expected 5th argument to be a number or a string, found type '${typeName(range)}'`)
    }
    if (type === 'minmax' && range.length !== 2) {
      throw new TypeError(`Expected exactly two values in array in 5th argument when 4th argument set to 'minmax', found '${range.length}' value(s)`)
    }
    if (type === 'minmax') {
      if (typeName(range[0]) !== 'number') {
        throw new TypeError(`Expected value in pos 0 of array given as 5th argument to be a number. Found value [${range[0]}] with type ${typeName(range[0])}.`)
      }
      if (typeName(range[1]) !== 'number') {
        throw new TypeError(`Expected value in pos 1 of array given as 5th argument to be a number. Found value [${range[1]}] with type ${typeName(range[1])}.`)
      }
    }
    if (!errorCodes.includes(code)) {
      throw new RangeError(`Number ${code} given as first argument isn't a valid error code.`)
    }
    if (message.length < 3) {
      throw new Error(`Expected length of string ${message} given as 2nd argument to be 3 characters or longer`)
    }
    if (fileName === '') {
      throw new Error(`Empty string is not allowed as 3rd argument`)
    }

    this.name = 'XRangeError'
    this.fileName = fileName
    this.code = code
    this.type = type
    this.range = range
  }
}

module.exports = XRangeError
