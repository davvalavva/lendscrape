/** @module errors/print-error/get-output */

const typeName = require('type-name')
const { filepath } = require('../../helpers/common-debug-tools.js')
const getOutputStandard = require('./get-output-standard')

/**
 * Returns a string for output in terminal
 *
 * @param {Error} errObj
 */
module.exports = (errObj) => {
  try {
    if (!(errObj instanceof Error)) {
      const thrownStr = `This error was thrown in '${filepath(__filename)}'`
      throw new TypeError(`Expected the argument to be of type Error, found type '${typeName(errObj)}'.\n${thrownStr}`)
    }
    // TODO: Customized outputs for different errors?
  } catch (e) {
    console.error(errObj)
    throw e
  }
  return getOutputStandard(errObj)
}
