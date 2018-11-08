/** @module errors/print-error */

const path = require('path')
const typeName = require('type-name')
const getOutput = require('./get-output')
const { OS, projectRoot: dir } = require('../../config/env.json')

const filename = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${dir}${filename}`

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
