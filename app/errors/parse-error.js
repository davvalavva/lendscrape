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

const path = require('path')
const typeName = require('type-name')
const printError = require('./print-error')
const logError = require('../libs/log-error')
const { OS, projectRoot: dir } = require('../config/env.json')
const { debugMode, enableLogging: loggingEnabled } = require('../config/runtime.json')

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${dir}${fName}`

/**
 * An general error class for parsing errors that have no better
 * suited alternative among its subclasses.
 *
 * @extends Error
 */
class ParseError extends Error {
  /**
   * @param {string} message
   * @param {string} fileName
   */
  constructor(...args) {
    const [message, fileName] = args

    super(message)

    try {
      const thrownStr = `This error was thrown in '${filepath}'`

      if (typeName(message) !== 'string') {
        throw new TypeError(`Erroneous throwing of ParseError.\nExpected first argument to be a string, found type '${typeName(message)}'.\n${thrownStr}`)
      }
      if (message.trim() === '') {
        throw new Error(`Erroneous throwing of ParseError.\nString is empty or only whitespaces in first argument.\n${thrownStr}`)
      }
      if (typeName(fileName) !== 'string') {
        throw new TypeError(`Erroneous throwing of ParseError.\nExpected second argument to be a string, found type '${typeName(fileName)}'.\n${thrownStr}`)
      }
      if (fileName.trim() === '') {
        throw new Error(`Erroneous throwing of ParseError.\nString is empty or only whitespaces in second argument.\n${thrownStr}`)
      }
      this.name = 'ParseError'
      this.fileName = fileName
    } catch (e) {
      if (debugMode) {
        if (debugMode === 1) printError(e)
        if (loggingEnabled) logError(e)
        throw e
      }
    }
  }
}

module.exports = ParseError
