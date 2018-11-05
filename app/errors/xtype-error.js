/**
 * @file Custom error class for type errors
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

/**
 * An error class for type errors. Use only when no better suited subclass is found.
 *
 * @module errors/xtype-error
 */

const typeName = require('type-name')

/**
 * An general error class for type errors that have no better
 * suited alternative among its subclasses.
 *
 * @extends Error
 */
class XTypeError extends Error {
  /**
   * Creates an XTypeError instance
   *
   * @param {string} message
   * @param {string} fileName
   */
  constructor(...args) {
    const [message, fileName] = args

    super(message)


    if (typeName(message) !== 'string' || message.trim() === '') {
      throw new TypeError(`Expected second argument to be a non-empty string, found type '${typeName(message)}'`)
    }
    if (typeName(fileName) !== 'string' || fileName.trim() === '') {
      throw new TypeError(`Expected third argument to be a non-empty string, found type '${typeName(fileName)}'`)
    }

    this.name = 'XTypeError'
    this.fileName = fileName
  }
}

module.exports = XTypeError
