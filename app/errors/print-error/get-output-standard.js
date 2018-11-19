/** @module errors/print-error/get-output-standard */

const typeName = require('type-name')
const { filepath } = require('../../helpers/common-debug-tools.js')
const { outputStacktrace: printStacktrace } = require('../../config/runtime.json')

/**
 * Returns a string for output in terminal
 *
 * @param {Error} errObj
 */
module.exports = (errObj) => {
  let output
  try {
    if (!(errObj instanceof Error)) {
      const thrownStr = `This error was thrown in '${filepath(__filename)}'`
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
    if (errObj.subject) {
      let out
      try {
        out += `\n\nSubject of error:\n${JSON.stringify(errObj.subject, null, 2)}`
        output += out
      } catch (e) {
        output += `\n\nSubject of error:\nProblems stringifying, probably because of circular references (most often a Promise)`
      }
    }
    if (errObj.kasper) {
      output += `\n\nKasper ouput:\n`
      output += JSON.stringify(errObj.kasper)
    }
    if (errObj.args) {
      let out
      try {
        out += `\n\nArguments debug info:\n`
        out += JSON.stringify(errObj.args, null, 2)
        output += out
      } catch (e) {
        output += `\n\nArguments debug info:\nProblems stringifying, probably because of circular references (most often a Promise)`
      }
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
