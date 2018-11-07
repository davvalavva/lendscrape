const AbstractError = require('./abstract-error')

/*
 * An error representing a failure when validating some data structure
 *
 * Arguments:
 *    message        a non-empty and non-whitespace-only string with an error message
 */
class ValidationError extends AbstractError {
  constructor(message) {
    super(message, { name: 'ValidationError' })
  }
}

module.exports = ValidationError
