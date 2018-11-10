/** @module errors/validation-error */

const ExtendableError = require('es6-error')
const typeName = require('type-name')
const path = require('path')
const printError = require('./print-error')
const logError = require('../libs/log-error')
const { OS, projectRoot: dir } = require('../config/env.json')
const { debugMode, enableLogging: loggingEnabled } = require('../config/runtime.json')

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${dir}${fName}`

class AbstractError extends ExtendableError {
  constructor(message) {
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
        err.path = filepath
        throw err
      }
    } catch (e) {
      if (debugMode) {
        if (debugMode === 1) printError(e)
        if (loggingEnabled) logError(e)
      }
      throw e
    }
  }
}

module.exports = AbstractError
