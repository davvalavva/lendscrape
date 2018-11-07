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

const filename = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${dir}${filename}`

/**
 * Prints error messages to terminal
 * (2nd arg. only for injecting environment when testing)
 *
 * @param {Error} errObj The thrown Error to be printed to terminal
 * @returns {boolean} Returns true if no error happens
 */
module.exports = (errObj) => {
  try {
    if (!(errObj instanceof Error)) {
      throw new TypeError(`Expected argument to be of type Error but found type '${typeName(errObj)}' This error was thrown in file ${filepath}`)
    }
    console.error(getOutput(errObj))
  } catch (e) {
    console.error(getOutput(e))
    throw e
  }
  return true
}
