/** @module errors/status-code-error */

const AbstractError = require('./abstract-error')

/*
 * An error representing a HTTP error
 */
class StatusCodeError extends AbstractError {}

module.exports = StatusCodeError
