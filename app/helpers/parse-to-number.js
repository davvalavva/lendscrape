/**
 * @file Parses numeric strings to Numbers.
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

/**
 * Parses numeric strings to Numbers. Strips out any non numeric characters in strings
 * except minus character and, depending on arguments, also decimal separator.
 *
 * By default, the decimals are truncated. This can be changed with an argument setting.
 *
 * @module helpers/parse-to-number
 */

const path = require('path')
const typeName = require('type-name')
const env = require('../config/env.json')
const ParseError = require('../config/ParseError')
const XTypeError = require('../config/XTypeError')

const filename = env.OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)

/**
 * Takes a string representing som numeric value and parses it to a Number.
 * All non-numeric characters are stripped out except the minus sign and,
 * depending on given arguments, also the decimal separator.
 *
 * By default, the decimals are truncated. This can be changed with an argument setting.
 *
 * @param {string} str The string to be parsed
 * @param {boolean} keepDecimals Set to true to keep decimals. Default: false
 * @param {string} decimalSep The character that is the decimal separator in the string.
 * If not set it's assumed to be the comma character.
 * @return {number} The number resulting from the parsing
 */
module.exports = (str, keepDecimals = false, decimalSep = ',') => {
  if (typeName(str) !== 'string' && typeName(str) !== 'number') {
    throw new XTypeError(
      300,
      `Expected first argument to be a string or a number, found type '${typeName(str)}'`,
      filename,
      ['string', 'number'],
      typeName(str)
    )
  }
  if (str.trim && str.trim() === '') {
    throw new ParseError(200, 'Empty string', filename, str)
  }

  // Return the value as-is if it's already a number (also strip decimals if keepDecimals === false)
  if (typeName(str) === 'number') return keepDecimals ? str : Math.trunc(str)

  // build regex to strip out everything except digits, decimal point and minus sign:
  const regex = new RegExp(`[^0-9-${decimalSep}]`, ['g'])
  let parsed = str.toString() // explicitly convert to string
  parsed = parsed
    .replace(regex, '') // strip out any cruft
    .replace(decimalSep, '.') // make sure decimal point is standard

  parsed = parseFloat(parsed)

  return keepDecimals ? parsed : Math.trunc(parsed)
}
