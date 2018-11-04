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
const _env = require('../config/env.json') // eslint-disable-line
const errorCodes = require('../config/error-codes.json')
const { ValidationError } = require('../config/custom-errors')

/**
 * Prints error messages to terminal
 * (2nd arg. only for injecting environment when testing)
 *
 * @param {object} errorInstance The thrown Error, descendants of Error allowed
 */
module.exports = (errorInstance, env = _env) => {
  if (!(errorInstance instanceof Error)) {
    throw new TypeError(`Expected first argument to be of type Error, found type '${typeName(errorInstance)}'`)
  }
  if (env.rulerLen === undefined) {
    throw new ReferenceError(`Environment setting 'rulerLen' is missing`)
  }
  if (typeName(env.rulerLen) !== 'number') {
    throw new TypeError(`Environment setting 'rulerLen' must be a number, found type '${typeName(env.rulerLen)}'`)
  }
  if (env.rulerChar === undefined) {
    throw new ReferenceError(`Environment setting 'rulerChar' is missing`)
  }
  if (typeName(env.rulerChar) !== 'string') {
    throw new TypeError(`Environment setting 'rulerChar' must be a string, found type '${typeName(env.rulerChar)}'`)
  }

  const { rulerLen, rulerChar } = env
  let rulerStr = ''
  for (let i = 0; i < rulerLen; i += 1) {
    rulerStr = `${rulerStr}${rulerChar}`
  }

  let output = ''
  output += `${rulerStr}\n`
  output += `${errorInstance.name}\n`

  if (errorInstance instanceof ValidationError) {
    output += `Error:  ${errorInstance.code} ${errorInstance.message}\n`
    output += `File:   ${errorInstance.fileName}\n`
    output += `Reason: ${errorCodes.find(arr => arr[0] === errorInstance.code)[1]}\n`
  } else {
    output += `Message:  ${errorInstance.message}\n`
  }
  // TODO: Customized messages for different error types

  output += `${rulerStr}\n`

  console.log(output)
}
