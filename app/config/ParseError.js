/**
 * @file Parsing Error class. An Error class for customized errors.
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const typeName = require('type-name')
const errorCodes = require('./error-codes').map(arr => arr[0])

class ParseError extends Error {
  constructor(...args) {
    const [code, message, fileName, target] = args

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
    if (['null', 'function', 'undefined', 'boolean', 'Date', 'Error', 'Math', 'JSON', 'Arguments', 'symbol', 'Promise'].indexOf(typeName(target)) !== -1) {
      throw new TypeError(`Unexpected type '${typeName(target)}' found for 4th argument '${typeName(fileName)}'`)
    }
    if (!errorCodes.includes(code)) {
      throw new RangeError(`Number ${code} given as first argument isn't a valid error code.`)
    }
    if (message.length < 3) {
      throw new Error(`Expected length of string ${message} given as 2nd argument to be 3 characters or longer`)
    }
    if (fileName.trim() === '') {
      throw new Error(`Empty string or only whitespaces in string is not allowed as 3rd argument`)
    }


    this.name = 'ParseError'
    this.fileName = fileName
    this.code = code
    this.target = target
  }
}

module.exports = ParseError
