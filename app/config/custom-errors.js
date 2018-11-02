/**
 * @file Custom Error classes
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const typeName = require('type-name')
const errorCodes = require('./error-codes').map(arr => arr[0])

class FormatError extends Error {
  constructor(message) {
    super(message)
    this.name = 'FormatError'
  }
}

class ValidationError extends Error {
  constructor(code, message, fileName, scope = {}) {
    if (arguments.length < 3) {
      throw new TypeError(`Expected 3 or 4 arguments, got ${arguments.length} arguments`)
    }
    if (typeName(code).toLocaleLowerCase() !== 'number') {
      throw new TypeError(`Expected first argument to be a number, found type '${typeName(code)}'`)
    }
    if (typeName(message).toLocaleLowerCase() !== 'string') {
      throw new TypeError(`Expected second argument to be a string, found type '${typeName(message)}'`)
    }
    if (typeName(fileName).toLocaleLowerCase() !== 'string') {
      throw new TypeError(`Expected third argument to be a string, found type '${typeName(fileName)}'`)
    }
    if (typeName(scope).toLocaleLowerCase() !== 'object') {
      throw new TypeError(`Expected 4th argument to be an object, found type '${typeName(scope)}'`)
    }
    if (!errorCodes.includes(code)) {
      throw new RangeError(`Number ${code} given as first argument isn't a valid error code.`)
    }
    if (message.length < 3) {
      throw new FormatError(`Expected length of string ${message} given as 2nd argument to be 3 characters or longer`)
    }
    if (fileName === '') {
      throw new FormatError(`Empty string is not allowed as 3rd argument`)
    }
    super(message)
    this.name = 'ValidationError'
    this.fileName = fileName
    this.code = code
    this.scope = scope
  }
}

class ParseError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ParseError'
  }
}

module.exports = { ValidationError, ParseError }
