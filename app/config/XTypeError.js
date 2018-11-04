/**
 * @file A type Error class. An Error class for customized errors.
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const typeName = require('type-name')
const { builtInTypes } = require('./env.json')
const errorCodes = require('./error-codes').map(arr => arr[0])

class XTypeError extends Error {
  constructor(...args) {
    const [code, message, fileName, expected, found] = args

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
    if (!errorCodes.includes(code)) {
      throw new RangeError(`Number ${code} given as first argument isn't a valid error code.`)
    }
    if (message.length < 3) {
      throw new Error(`Expected length of string ${message} given as 2nd argument to be 3 characters or longer`)
    }
    if (fileName === '') {
      throw new Error(`Empty string is not allowed as 3rd argument`)
    }
    if (typeName(expected) !== 'string' && typeName(expected) !== 'Array') {
      throw new TypeError(`Expected 4th argument to be a string or an array of strings, found type '${typeName(message)}'`)
    }
    if (typeName(expected) === 'Array' && expected.length === 0) {
      throw new TypeError(`Array given in 4th argument can't be empty`)
    }
    if (typeName(expected) === 'Array' && !expected.every(val => typeName(val) === 'string')) {
      throw new TypeError(`Array given in 4th can't contain non-string values`)
    }
    if (typeName(found) !== 'string') {
      throw new TypeError(`Expected 5th argument to be a string, found type '${typeName(message)}'`)
    }
    if (!builtInTypes.includes(found)) {
      throw new RangeError(`Expected 5th argument to have a string value with a known built in type, found string '${found}'`)
    }
    if (typeName(expected) === 'string' && !builtInTypes.includes(expected)) {
      throw new RangeError(`Expected 4th argument to have a string value with a known built in type, found string '${expected}'`)
    }
    if (typeName(expected) === 'Array' && !expected.every(val => builtInTypes.includes(val))) {
      throw new RangeError(`Invalid string value. All string values of the array given in 4th argument must be of a known built in type.`)
    }

    this.name = 'XTypeError'
    this.fileName = fileName
    this.code = code
    this.expected = expected
    this.found = found
  }
}

module.exports = XTypeError
