/** @module errors/print-error/get-output */

const path = require('path')
const typeName = require('type-name')
const { OS, projectRoot: dir } = require('../../config/env.json')
const getOutputStandard = require('./get-output-standard')

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${dir}${fName}`

/**
 * Returns a string for output in terminal
 *
 * @param {Error} errObj
 */
module.exports = (errObj) => {
  try {
    if (!(errObj instanceof Error)) {
      const thrownStr = `This error was thrown in '${filepath}'`
      throw new TypeError(`Expected the argument to be of type Error, found type '${typeName(errObj)}'.\n${thrownStr}`)
    }
    // TODO: Customized outputs for different errors?
  } catch (e) {
    console.error(errObj)
    throw e
  }
  return getOutputStandard(errObj)
}
