/**
 * @file Prints error messages to terminal
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

/** @module errors/print-error */

const path = require('path')
const typeName = require('type-name')
const { OS, projectRoot: dir } = require('../config/env.json')
const { debugMode, enableLogging: loggingEnabled, outputStacktrace: printStacktrace } = require('../config/runtime.json')
// const ValidationError = require('./validation-error')
// const ParseError = require('./parse-error')
// const XTypeError = require('./xtype-error')
// const XRangeError = require('./xrange-error')

const filename = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${dir}${filename}`

/**
 * Prints error messages to terminal
 * (2nd arg. only for injecting environment when testing)
 *
 * @param {Error} errObj The thrown Error
 */
module.exports = (errObj) => {
  try {
    if (!(errObj instanceof Error)) {
      throw new TypeError(`Error when trying to throw. Expected thrown value to be of type Error but found type '${typeName(errObj)}'`)
    }
    const hr = '********************************************************************************************************************************************\n'
    let output = hr
    output += `${errObj.name}\n`
    output += `Thrown in file: '${errObj.fileName}'\n`
    output += `With message: '${errObj.message}'\n`
    output += hr
    console.log(output)
  } catch (e) {
    if (debugMode) {
      const hr = '------------------------------------------------------------------------------------------------------------------------------------------------------\n'
      const sep = '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n'
      let output = `\n${hr}\n`
      if (debugMode === 1) {
        output += `******** ${e.name} ********\n\n\n`
        output += `Thrown in file:\n${filepath}\n\n`
        output += `${sep}\nWith message:\n${e.message}\n\n`
        output += printStacktrace ? `${sep}\nStacktrace:\n${e.stack}\n` : ''
        if (loggingEnabled) { /* TODO logging */ }
        output += `\n${hr}`
        console.log(output)
      }
      throw e
    } else {
      console.log(`A fatal error has occured! Program has been stopped.`)
      if (loggingEnabled) { /* TODO logging */ }
      process.exit(1)
    }
  }
}
