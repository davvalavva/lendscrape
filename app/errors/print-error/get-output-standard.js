/**
 * @file Returns a string for output in terminal
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

/** @module errors/print-error/get-output-standard */

const path = require('path')
const typeName = require('type-name')
const { hr, sep } = require('./config')
const { OS, projectRoot: dir } = require('../../config/env.json')
const { outputStacktrace: printStacktrace } = require('../../config/runtime.json')

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${dir}${fName}`

/**
 * Returns a string for output in terminal
 *
 * @param {Error} errObj
 */
module.exports = (errObj) => {
  let output
  try {
    if (!(errObj instanceof Error)) {
      const thrownStr = `This error was thrown in '${filepath}'`
      throw new TypeError(`Expected the argument to be of type Error, found type '${typeName(errObj)}'.\n${thrownStr}`)
    }

    output = `\n${hr}\n******** ${errObj.name} ********\n\n\n${sep}\nWith message:\n${errObj.message}\n\n`
    if (printStacktrace) {
      output += `${sep}\nStacktrace:\n${errObj.stack}\n`
    }
    output += `\n${hr}\n`
  } catch (e) {
    console.error(e)
    throw e
  }

  return output
}
