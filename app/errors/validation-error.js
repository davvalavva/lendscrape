/** @module errors/validation-error */

const AbstractError = require('./abstract-error')

/*
 * An error representing a failure when validating some data structure
 */
class ValidationError extends AbstractError {}

module.exports = ValidationError
