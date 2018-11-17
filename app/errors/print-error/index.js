/** @module errors/print-error */

const typeName = require('type-name')
const { filepath } = require('../../helpers/common-debug-tools.js')
const getOutput = require('./get-output')

module.exports = (errObj) => {
  try {
    if (!(errObj instanceof Error)) {
      throw new TypeError(`Expected argument to be of type Error but found type '${typeName(errObj)}' This error was thrown in file ${filepath(__filename)}`)
    }
    console.error(getOutput(errObj))
  } catch (e) {
    console.error(getOutput(e))
    throw e
  }
  return true
}
