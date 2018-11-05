/**
 * @file Custom error class for validation errors
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

/**
 * An error class for validation errors. Use only when no better suited subclass is found.
 *
 * @module errors/validation-error
 */

const typeName = require('type-name')

/**
 * An general error class for validation errors that have no better
 * suited alternative among its subclasses.
 *
 * @extends Error
 */
class ValidationError extends Error {
  /**
   * @param {string} message
   * @param {string} fileName
   */
  constructor(...args) {
    const [message, fileName] = args

    super(message)

    if (args.length !== 2) {
      throw new TypeError(`Expected exactly 2 arguments, got ${args.length} arguments`)
    }
    if (typeName(message) !== 'string' || message === '') {
      throw new TypeError(`Expected first argument to be a non-empty string, found type '${typeName(message)}'`)
    }
    if (typeName(fileName) !== 'string' || fileName === '') {
      throw new TypeError(`Expected second argument to be a string, found type '${typeName(fileName)}'`)
    }

    this.name = 'ValidationError'
    this.fileName = fileName
  }
}

module.exports = ValidationError
