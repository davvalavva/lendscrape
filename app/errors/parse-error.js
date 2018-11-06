/**
 * @file Custom Error class for parsing errors
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

/**
 * An error class for parse errors. Use only when no better suited subclass is found.
 *
 * @module errors/parse-error
 */

const AbstractError = require('./abstract-error')

/**
 * An general error class for parsing errors that have no better
 * suited alternative among its subclasses.
 *
 * @extends Error
 */
class ParseError extends AbstractError {
  /**
   * @param {string} message
   * @param {string} fileName
   */
  constructor(...args) {
    const [message, fileName] = args
    const errorName = 'ParseError'
    super(message, fileName, errorName)
  }
}

module.exports = ParseError
