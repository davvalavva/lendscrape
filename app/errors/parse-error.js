const AbstractError = require('./abstract-error')

/*
 * An error representing a failure of some kind of parsing going on.
 *
 * Arguments:
 *    message        a non-empty and non-whitespace-only string with an error message
 */
class ParseError extends AbstractError {
  constructor(message) {
    super(message, { name: 'ParseError' })
  }
}

module.exports = ParseError
