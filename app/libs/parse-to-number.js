/* eslint-disable max-len */

/** @module libs/parse-to-number */

/**
 * @function
 * This function takes a string representing a numeric value and converts it to a Number.
 * Before the conversion happens, all non-numeric characters are stripped out except
 * the minus sign and the decimal separator. In the resulting Number after the conversion
 * and before returning the value, the decimals are truncated. This however, can be changed
 * with the optional configuration object argument.
 *
 * PARAMETERS:
 * in order   Type      Name    Required  Default   Description
 * ============================================================================================================================
 * @param     {string}  str     yes                 A required string or a number. If this is a string it will be converted
 *                                                  to a Number. If this is a number it will just be returned with any
 *                                                  decimals truncated unless the keepDec setting is set to to true,
 *                                                  than it will the number without truncating it before.
 *
 * @param     {object}  [cfg]   no        {}        An optional configuration object for altering the parsers behaviour.
 *
 *      PROPERTIES:
 *      'cfg'     Type      Name        Required  Default   Description
 *      =======================================================================================================================
 *      @property {boolean} [keepDec]   no        false     If set to true, keeps the decimals in the resulting number.
 *      @property {string}  [decSep]    no         ','      The character that the parser interprets as the decimal separator.
 *                                                          If set, must be one character only.
 *
 * RETURNS:
 * @return {number} Returns the parsed number
 *
 * OPERATIONAL ERRORS:
 * @todo  IMPORTANT: Think through the many possible ways parsing of
 *        conversion of strings to numbers can "go wrong" considering that
 *        this is the data that is to be stored in database and then presented
 *        on the website(s).
 *        And of course, handle those failures apropriately.
 */

/* eslint-enable max-len */
const path = require('path')
const typeName = require('type-name')
const {
  OS,
  projectRoot
} = require('../config/env.json')
const {
  debugMode,
  enableLogging
} = require('../config/runtime.json')
const ParseError = require('../errors/parse-error')
const printError = require('../errors/print-error')
const logError = require('../libs/log-error')

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${projectRoot}${fName}`

// override config in 'runtime.json'
const debug = debugMode // 0 = no debug, 1 = normal, 2 = testing
const log = enableLogging // true|false

module.exports = (str, { keepDec = false, decSep = ',' } = {}) => {
  let parsed
  try {
    let err
    // return str as is, if it's a number
    if (typeName(str) === 'number') {
      return keepDec ? str : Math.trunc(str) // strip decimals if keepDec set to false
    }
    if (typeName(str) !== 'string' && typeName(str) !== 'number') {
      err = new TypeError(`Expected a string or a number as first argument but found value with type '${typeName(str)}'`)
    } else if (str.trim && str.trim() === '') {
      err = new ParseError(`Can't parse empty string or string with only whitespaces`)
    }
    if (err) {
      err.path = filepath
      throw err
    }

    // strip out everything except digits, decimal separator and minus sign
    const regex = new RegExp(`[^0-9-${decSep}]`, 'g')
    parsed = str
      .replace(regex, '')
      .replace(decSep, '.') // JS recognizable decimal before parseFloat()

    parsed = parseFloat(parsed)
  } catch (e) {
    if (debug) {
      if (debug === 1) printError(e)
      if (log) logError(e)
    }
    throw e
  }

  return keepDec ? parsed : Math.trunc(parsed)
}
