/**
 * @file Parsing Error class. An Error class for customized errors.
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const typeName = require('type-name')

class ParseError extends Error {
  constructor(...args) {
    const [message, fileName] = args

    super(message)

    if (typeName(message) !== 'string' || message.trim() === '') {
      throw new TypeError(`Expected first argument to be a non-empty string, found type '${typeName(message)}'`)
    }
    if (typeName(fileName) !== 'string' || fileName.trim() === '') {
      throw new TypeError(`Expected second argument to be a non-empty string, found type '${typeName(fileName)}'`)
    }

    this.name = 'ParseError'
    this.fileName = fileName
  }
}

module.exports = ParseError
