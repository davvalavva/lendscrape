/**
 * @file Prints error messages to terminal
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

/** @module errors/print-error */

const path = require('path')
const typeName = require('type-name')
const getOutput = require('./get-output')
const { OS, projectRoot: dir } = require('../../config/env.json')
let { debugMode } = require('../../config/runtime.json')

const filename = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${dir}${filename}`

/**
 * Prints error messages to terminal
 * (2nd arg. only for injecting environment when testing)
 *
 * @param {Error} errObj The thrown Error to be printed to terminal
 * @returns {boolean} Returns true if no error happens
 */
module.exports = (errObj, injectedMode = null /* used for testing only */) => {
  try {
    if (!(errObj instanceof Error)) {
      throw new TypeError(`Expected argument to be of type Error but found type '${typeName(errObj)}' This error was thrown in file ${filepath}`)
    }

    if (typeof injectedMode === 'number') debugMode = injectedMode
    if (debugMode === 1) {
      const output = getOutput(errObj)
      console.log(output)
    }
  } catch (e) {
    if (debugMode) {
      if (debugMode === 1) {
        console.log(getOutput(e))
      }
      throw e
    } else {
      console.log(`A non recoverable error has caused this program to stop!`)
      process.exit(1)
    }
  }
  return true
}
