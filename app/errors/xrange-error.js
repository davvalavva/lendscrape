/**
 * @file Custom error class for range errors
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

/**
 * An error class for range errors. Use only when no better suited subclass is found.
 *
 * @module errors/xrange-error
 */

const typeName = require('type-name')

/**
 * An general error class for range errors that have no better
 * suited alternative among its subclasses.
 *
 * @extends Error
 */
class XRangeError extends Error {
  /**
   * Creates an XRangeError instance
   *
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

    this.name = 'XRangeError'
    this.fileName = fileName
  }
}

module.exports = XRangeError
