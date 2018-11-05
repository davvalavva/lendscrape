/**
 * @file Custom Error class for parsing errors
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

/**
 * An error class for parsing errors. Use only when no better suited subclass is found.
 *
 * @module errors/validation-error
 */

const typeName = require('type-name')

/**
 * An general error class for parsing errors that have no better
 * suited alternative among its subclasses.
 *
 * @extends Error
 */
class ParseError extends Error {
  /**
   * @param {string} message
   * @param {string} fileName
   */
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
