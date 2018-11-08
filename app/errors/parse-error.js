/** @module errors/parse-error */

const AbstractError = require('./abstract-error')

/*
 * An error representing a failure of some kind when parsing something
 */
class ParseError extends AbstractError {}

module.exports = ParseError
