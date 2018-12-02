/** @module errors/validation-error */

const ExtendableError = require('es6-error')
const typeName = require('type-name')

class AbstractError extends ExtendableError {
  constructor(message) {
    super(message)

    if (this.constructor === AbstractError) throw new SyntaxError(`Can't instantiate AbstractError. It's an abstract class. Duh! ;)`)
    if (message === undefined) throw new ReferenceError(`Missing argument! Expected a string message.`)
    if (typeName(message) !== 'string') throw new TypeError(`Argument given to constructor must be a string. Found type '${typeName(message)}.`)
  }
}

module.exports = AbstractError
