/**
 * @file Abstract error class for custom error classes to inherit from
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

/**
 * Abstract error class for custom error classes to inherit from
 *
 * @module errors/abstract-error
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
 * Abstract error class for custom error classes to inherit from
 *
 * @extends Error
 */
class AbstractError extends Error {
  /**
   * @param {string} message
   * @param {string} fileName
   */
  constructor(...args) {
    const [message, fileName, errorName] = args
    super(message)

    try {
      // eslint-disable-next-line prefer-template
      const erroneous = `Erroneous throwing${typeName(errorName) === 'string' ? ' of ' + errorName : ''}.\n`
      const thrownStr = `This error was thrown in '${filepath}'`

      if (this.constructor === AbstractError) {
        throw new Error(`Instantiation of AbstractError isn't allowed.\n${thrownStr}`)
      }
      if (typeName(message) !== 'string') {
        throw new TypeError(`${erroneous}Expected first argument to be a non-empty string, found type '${typeName(message)}'.\n${thrownStr}`)
      }
      if (message.trim() === '') {
        throw new Error(`${erroneous}String is empty or only whitespaces in first argument.\n${thrownStr}`)
      }
      if (typeName(fileName) !== 'string') {
        throw new TypeError(`${erroneous}Expected second argument to be a string, found type '${typeName(fileName)}'.\n${thrownStr}`)
      }
      if (fileName.trim() === '') {
        throw new Error(`${erroneous}String is empty or only whitespaces in second argument.\n${thrownStr}`)
      }
      if (typeName(errorName) !== 'string') {
        throw new TypeError(`${erroneous}Expected third argument to be a string, found type '${typeName(errorName)}'.\n${thrownStr}`)
      }
      if (errorName.trim() === '') {
        throw new Error(`${erroneous}String is empty or only whitespaces in third argument.\n${thrownStr}`)
      }
      this.name = 'AbstractError'
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

module.exports = AbstractError
