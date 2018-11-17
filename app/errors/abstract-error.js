/** @module errors/validation-error */

const ExtendableError = require('es6-error')
const typeName = require('type-name')
const {
  printError, logError, filepath, debugMode, enableLogging
} = require('../helpers/common-debug-tools.js')

class AbstractError extends ExtendableError {
  constructor(message, cfg) {
    // for debugging and testing, overrides 'runtime.json' settings
    const debug = cfg && typeName(cfg.debug) === 'number'
      ? cfg.debug
      : debugMode // 0 = no debug, 1 = normal, 2 = testing
    const log = cfg && typeName(cfg.log) === 'boolean'
      ? cfg.log
      : enableLogging // boolean

    try {
      super(message)
      let err

      if (this.constructor === AbstractError) {
        err = new SyntaxError(`Can't instantiate AbstractError. It's an abstract class. Duh! ;)`)
      } else if (message === undefined) {
        err = new ReferenceError(`Missing argument! Expected a string message.`)
      } else if (typeName(message) !== 'string') {
        err = new TypeError(`Argument given to constructor must be a string. Found type '${typeName(message)}.`)
      }

      if (err) {
        err.signature = 'function(message)'
        err.args = [
          {
            position: 0, required: true, expectedType: 'string', foundType: typeName(message), foundValue: message
          }
        ]
        err.path = filepath(__filename)
        throw err
      }
    } catch (e) {
      if (debug === 1) printError(e)
      if (log) logError(e)
      throw e
    }
  }
}

module.exports = AbstractError
