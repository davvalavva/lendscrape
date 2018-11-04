/**
 * @file Validation Error class. An Error class for customized errors.
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const typeName = require('type-name')
const errorCodes = require('./error-codes').map(arr => arr[0])

class ValidationError extends Error {
  constructor(...args) {
    const [code, message, fileName, scope = {}] = args

    super(message)

    if (args.length < 3) {
      throw new TypeError(`Expected 3 or 4 arguments, got ${args.length} arguments`)
    }
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

    if (typeName(scope) !== 'Object') {
      throw new TypeError(`Expected 4th argument to be an object, found type '${typeName(scope)}'`)
    }

    this.name = 'ValidationError'
    this.fileName = fileName
    this.code = code
    this.scope = scope
  }
}

module.exports = ValidationError
