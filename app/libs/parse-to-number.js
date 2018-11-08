/*
 * This function takes a string representing a numeric value and converts it to a Number.
 * Before the conversion happens, all non-numeric characters are stripped out except
 * the minus sign and the decimal separator. In the resulting Number after the conversion
 * and before returning the value, the decimals are truncated. This however, can be changed
 * with the optional configuration object argument.
 *
 * ARGUMENTS
 *    str     A required string or a number. If this is a string it will be converted to a Number.
 *            If this is a number it will just be returned with any decimals truncated unless
 *            the keepDec setting is set to to true, than it will the number without truncating it
 *            before.
 *
 *    cfg     An optional configuration object for altering the parsers behaviour.
 *            Below are the available 'cfg' object properties.
 *
 *            PROPERTY          DEFAULT VALUE   DESCRIPTION
 *            =====================================================================================
 *            keepDec           false           A boolean that if set to true, keeps the decimals
 *                                              in the resulting number.
 *            decSep        ','                 A string containing exactly one character. This is
 *                                              the character that the parser interprets as the
 *                                              decimal separator in the string. Defaults is comma.
 *
 * POSSIBLE FAILURES
 *    TODO:
 *      IMPORTANT: Think through the many possible ways parsing of
 *      conversion of strings to numbers can "go wrong" considering that
 *      this is the data that is to be stored in database and then presented
 *      on the website(s).
 *      And of course, handle those failures apropriately.
 */

const path = require('path')
const typeName = require('type-name')
const { OS, projectRoot: dir } = require('../config/env.json')
const ParseError = require('../errors/parse-error')
const { debugMode, enableLogging: loggingEnabled } = require('../config/runtime.json')
const printError = require('../errors/print-error')
const logError = require('../libs/log-error')

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${dir}${fName}`

module.exports = (str, { keepDec = false, decSep = ',' } = {}) => {
  let parsed
  try {
    let err
    // Return the value of str as it is if it's a number (but strip decimals if keepDec === false)
    if (typeName(str) === 'number') {
      return keepDec ? str : Math.trunc(str)
    }
    if (typeName(str) !== 'string' && typeName(str) !== 'number') {
      err = new TypeError(`Expected a string or a number as first argument but found value with type '${typeName(str)}'`)
    }
    if (str.trim && str.trim() === '') {
      err = new ParseError(`Can't parse empty string or string with only whitespaces`)
    }
    if (err) {
      err.path = filepath
      throw err
    }

    // build regex to strip out everything except digits, decimal point and minus sign:
    const regex = new RegExp(`[^0-9-${decSep}]`, 'g')
    parsed = str
      .replace(regex, '') // strip out any cruft
      .replace(decSep, '.') // make sure decimal point is JS standard

    parsed = parseFloat(parsed)
  } catch (e) {
    if (debugMode) {
      if (debugMode === 1) printError(e)
      if (loggingEnabled) logError(e)
    }
    throw e
  }

  return keepDec ? parsed : Math.trunc(parsed)
}
