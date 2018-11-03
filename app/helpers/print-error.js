/**
 * @file Prints error messages to terminal
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

/**
 * Prints error messages to terminal
 *
 * @module helpers/print-error
 */

const typeName = require('type-name')
const _env = require('../config/env.json')

/**
 * Prints error messages to terminal
 * (2nd arg. so test can inject own env, not meant for use in production)
 *
 * @param {object} errData Error data to print plus options for linedivider(ruler) style
 */
module.exports = (errData, env = _env) => {
  if (arguments.length === 0) {
    throw new TypeError(`Missing argument, expected exactly 1 argument`)
  }
  if (typeName(errData).toLocaleLowerCase() !== 'object') {
    throw new TypeError(`Expected first argument to be an object, found type '${typeName(errData)}'`)
  }
  if (Object.keys(errData).length === 0 && errData.constructor === Object) {
    throw new TypeError(`Empty object as argument isn't allowed`)
  }
  if (typeName(errData.name).toLocaleLowerCase() !== 'string') {
    throw new TypeError(`Expected property 'name' in argument to be a string, found type '${typeName(errData.name)}'`)
  }
  if (typeName(errData.code).toLocaleLowerCase() !== 'number') {
    throw new TypeError(`Expected property 'code' in argument to be a number, found type '${typeName(errData.code)}'`)
  }
  if (typeName(errData.message).toLocaleLowerCase() !== 'string') {
    throw new TypeError(`Expected property 'message' in argument to be a string, found type '${typeName(errData.message)}'`)
  }
  if (typeName(errData.fileName).toLocaleLowerCase() !== 'string') {
    throw new TypeError(`Expected property 'fileName' in argument to be a string, found type '${typeName(errData.fileName)}'`)
  }
  if (errData.reason && typeName(errData.reason).toLocaleLowerCase() !== 'string') {
    throw new TypeError(`If set, property 'reason' in argument must be a string, found type '${typeName(errData.reason)}'`)
  }
  if (env.rulerLen == null) {
    throw new ReferenceError(`Environment setting 'rulerLen' is missing`)
  }
  if (env.rulerChar == null) {
    throw new ReferenceError(`Environment setting 'rulerChar' is missing`)
  }
  if (typeName(env.rulerLen).toLocaleLowerCase() !== 'number') {
    throw new TypeError(`Environment setting 'rulerLen' must be a number, found type '${typeName(env.rulerLen)}'`)
  }
  if (typeName(env.rulerChar).toLocaleLowerCase() !== 'string') {
    throw new TypeError(`Environment setting 'rulerChar' must be a string, found type '${typeName(env.rulerChar)}'`)
  }
  const rulerLen = errData.rulerLen ? errData.rulerLen : env.rulerLen
  const rulerChar = errData.rulerChar ? errData.rulerChar : env.rulerChar
  let rulerStr = ''
  for (let i = 0; i < rulerLen; i += 1) {
    rulerStr = `${rulerStr}${rulerChar}`
  }

  let output = ''
  output += `${rulerStr}\n`
  output += `${errData.name}\n`
  output += `Error:  ${errData.code} ${errData.message}\n`
  output += `File:   ${errData.fileName}\n`
  output += errData.reason ? `Reason: ${errData.reason}\n` : ''
  output += `${rulerStr}`
  console.log(output)
}
