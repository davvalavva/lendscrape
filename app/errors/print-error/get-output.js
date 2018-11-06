/**
 * @file Returns a string for output in terminal
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

/** @module errors/print-error/get-output */

const path = require('path')
const typeName = require('type-name')
const { OS, projectRoot: dir } = require('../../config/env.json')
const getOutputStandard = require('./get-output-standard')

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${dir}${fName}`

/**
 * Returns a string for output in terminal
 *
 * @param {Error} errObj
 */
module.exports = (errObj) => { // eslint-disable-line
  if (!(errObj instanceof Error)) {
    const thrownStr = `This error was thrown in '${filepath}'`
    throw new TypeError(`Expected the argument to be of type Error, found type '${typeName(errObj)}'.\n${thrownStr}`)
  }

  switch (errObj.name) {
    case 'ValidationError':
      // return getOutputVariantX()
      break
    case 'ParseError':
      // return getOutputVariantX()
      break
    case 'XTypeError':
      // return getOutputVariantX()
      break
    case 'XRangeError':
      // return getOutputVariantX()
      break
    default:
      return getOutputStandard(errObj)
  }
}
