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
 * PARAMETERS
 * first-to-last  Type      Name    Required  Default   Description
 * ================================================================================================================================================
 * @param         {string}  str     yes                 A required string or a number. If this is a string it will be converted
 *                                                      to a Number. If this is a number it will just be returned with any
 *                                                      decimals truncated unless the keepDec setting is set to true,
 *                                                      then it will return the number as is.
 *
 * @param         {object}  cfg     no        {}        Optional config object for altering the parsers behavior. See properties below.
 *                   ▼
 *                   ▼
 *                   ▼        Type      Name      Required  Default   Description
 *                =======================================================================================================================
 *                @property   {boolean} keepDec      no     false     If set to true, keeps the decimals in the resulting number.
 *                @property   {string}  decSep       no     ','       The character that the parser interprets as the decimal separator.
 *                                                                    If set, must be one character only.
 *
 *
 * @return {number} Returns the parsed number
 */
/* eslint-enable max-len */

const typeName = require('type-name')
const ParseError = require('../errors/parse-error')

module.exports = (str, cfg = {}) => {
  if (typeName(str) !== 'string' && typeName(str) !== 'number') {
    throw new TypeError(`Expected a string or a number as first argument but found value with type '${typeName(str)}'`)
  }
  if (str.trim && str.trim() === '') {
    throw new ParseError(`Can't parse empty string or string with only whitespaces`)
  }
  if (typeName(cfg) !== 'Object') {
    throw new TypeError(`When given second argument expects an object, found type '${typeName(cfg)}'`)
  }

  const { keepDec = false, decSep = ',' } = cfg

  // return str as is, if it's a number
  if (typeName(str) === 'number') {
    return keepDec ? str : Math.trunc(str) // strip decimals if keepDec set to false
  }

  // strip out everything except digits, decimal separator and minus sign
  const regex = new RegExp(`[^0-9-${decSep}]`, 'g')
  const parsed = str
    .replace(regex, '')
    .replace(decSep, '.') // JS recognizable decimal before parseFloat()

  return keepDec ? parseFloat(parsed) : Math.trunc(parseFloat(parsed))
}
