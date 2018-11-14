/** @module lib/parse-number */

/* eslint-disable max-len */
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
 * @param     {String}  str     yes                 A required string or a number. If this is a string it will be converted
 *                                                  to a Number. If this is a number it will just be returned with any
 *                                                  decimals truncated unless the keepDec setting is set to to true,
 *                                                  than it will the number without truncating it before.
 *
 * @param     {Object}  [cfg]   no        {}        An optional configuration object for altering the parsers behavior.
 *
 *      PROPERTIES:
 *      'cfg'     Type      Name        Required  Default   Description
 *      =======================================================================================================================
 *      @property {Boolean} [keepDec]   no        false     If set to true, keeps the decimals in the resulting number.
 *      @property {String}  [decSep]    no         ','      The character that the parser interprets as the decimal separator.
 *                                                          If set, must be one character only.
 *
 * RETURNS:
 * @return {Number} Returns the parsed number
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
const logError = require('./log-error')

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${projectRoot}${fName}`

module.exports = (str, cfg) => {
  // for debugging and testing, overrides 'runtime.json' settings
  const debug = cfg && typeName(cfg.debug) === 'number'
    ? cfg.debug
    : debugMode // 0 = no debug, 1 = normal, 2 = testing
  const log = cfg && typeName(cfg.log) === 'boolean'
    ? cfg.log
    : enableLogging // boolean

  let keepDec
  let decSep
  let parsed

  try {
    let err
    if (typeName(str) !== 'string' && typeName(str) !== 'number') {
      err = new TypeError(`Expected a string or a number as first argument but found value with type '${typeName(str)}'`)
    } else if (str.trim && str.trim() === '') {
      err = new ParseError(`Can't parse empty string or string with only whitespaces`)
    } else if (cfg !== undefined && typeName(cfg) !== 'Object') {
      err = new TypeError(`Expected 2nd arg. to be an object, found type '${typeName(cfg)}'`)
    }
    if (err) {
      err.signature = 'function(str, cfg)'
      err.args = [
        {
          position: 0, required: true, expectedType: 'string|number', foundType: typeName(str), foundValue: str
        },
        {
          position: 1, required: false, expectedType: 'Object', foundType: typeName(cfg), foundValue: cfg
        }
      ]
      err.path = filepath
      throw err
    }
    if (typeName(cfg) === 'Object') {
      ({ keepDec = false, decSep = ',' } = cfg)
    } else {
      keepDec = false
      decSep = ','
    }
    // return str as is, if it's a number
    if (typeName(str) === 'number') {
      return keepDec ? str : Math.trunc(str) // strip decimals if keepDec set to false
    }

    // strip out everything except digits, decimal separator and minus sign
    const regex = new RegExp(`[^0-9-${decSep}]`, 'g')
    parsed = str
      .replace(regex, '')
      .replace(decSep, '.') // JS recognizable decimal before parseFloat()

    parsed = parseFloat(parsed)
  } catch (e) {
    if (debug === 1) printError(e)
    if (log) logError(e)
    throw e
  }

  return keepDec ? parsed : Math.trunc(parsed)
}
