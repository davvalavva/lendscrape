/** @module errors/print-error/get-output-standard */

const path = require('path')
const typeName = require('type-name')
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

    output = `\n\n========================================================================`
    output += `\n${errObj.name}\n\n${errObj.message}`
    if (errObj.path) {
      output += `\n\nThrown in file:\n${errObj.path}`
    }
    if (errObj.signature) {
      output += `\n\nSyntax:\n${errObj.signature}`
    }
    if (errObj.args) {
      output += `\n\nArguments debug info:\n`
      output += JSON.stringify(errObj.args, null, 2)
    }
    if (printStacktrace) {
      output += `\n\nStacktrace:\n\n${errObj.stack}\n`
    }
    output += `\n\n\n`
  } catch (e) {
    console.error(e)
    throw e
  }

  return output
}
