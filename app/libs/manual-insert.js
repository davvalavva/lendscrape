/* eslint-disable max-len */

/** @module libs/manual-insert */

/**
 * @function
 * Creates and returns an object from an array of objects passed to the function. Each of
 * the objects in the array contains two properties, a property named 'key' and another named 'value'.
 * EXAMPLE:
 * Passing the following array to the function...
 * [
 *  { key: 'rate',     value: 0.3  },
 *  { key: 'nrOfDays', value: 30   },
 *  { key: 'amount',   value: 1200 }
 * ]
 * ... would return the following object:
 * {
 *  rate:     0.3,
 *  nrOfDays: 30,
 *  amount:   1200
 * }
 *
 * The main purpose of this function inside this application is to enable the administrator to manually
 * insert data into an object holding data that have just been scraped from a website. Such objects,
 * called documents, are then saved into a Mongo database. The reason this functionality is need
 * is due to the fact that all data sought in a website isn't always easily available or
 * explicitly stated somewhere in a website and therefor needs to be entered into the database manually somehow.
 *
 * Function parameters:
 *
 * ARGUMENT   TYPE        NAME              REQUIRED  DESCRIPTION
 * ==================================================================================================================================
 * @param     {Object[]}  propDescriptions  yes       An array of objects, with each object in the array having
 *                                                    two properties, namely the 'key' and 'value' properties.
 *                                                    The value of these two properties for every object in the
 *                                                    array will be found in the returned object where the value
 *                                                    of 'key' value will correspond to a property name in the
 *                                                    object and the value of 'value' will be that properties value.
 *
 * RETURNS:
 * @return {Object} An object (=== document) reduced from the passed array of objects
 *
 * OPERATIONAL ERRORS
 *    @todo
 */

/* eslint-enable max-len */
const typeName = require('type-name')
const path = require('path')
const ValidationError = require('../errors/validation-error')
const printError = require('../errors/print-error')
const logError = require('./log-error')
const {
  OS,
  projectRoot
} = require('../config/env.json')
const {
  debugMode,
  enableLogging
} = require('../config/runtime.json')

const fName = OS === 'win' ? path.win32.basename(__filename) : path.posix.basename(__filename)
const filepath = `${projectRoot}${fName}`

// override config in 'runtime.json'
const debug = debugMode // 0 = no debug, 1 = normal, 2 = testing
const log = enableLogging // true|false

module.exports = (propDescriptions) => {
  // mapper({ key: 'rate', value: 0.3 }) >>> { rate: 0.3 }
  const mapper = obj => ({ [obj.key]: obj.value })
  // reducer({ rate: 0.3 }, { nrOfDays: 30 }) >>> { rate: 0.3, nrOfDays: 30 }
  const reducer = (accumulated, current) => ({ ...accumulated, ...current })
  let mapped
  try {
    let err
    if (propDescriptions === undefined) {
      err = new ReferenceError(`Missing argument! Expected an array.`)
    } else if (typeName(propDescriptions) !== 'Array') {
      err = new TypeError(`Expected argument to be an array but found type '${typeName(propDescriptions)}'.`)
    } else if (!propDescriptions.every(obj => typeName(obj) === 'Object')) {
      err = new ValidationError(`Expected every element in array passed to function to be an object.`)
    } else if (!propDescriptions.every(obj => Object.keys(obj).length) > 0) {
      err = new ValidationError(`Empty objects are not allowed inside array passed to function.`)
    } else if (propDescriptions.length > 0 && !propDescriptions.every(obj => Object.keys(obj).indexOf('value') !== -1)) {
      err = new ValidationError(`Expected every object inside array passed to function to have a property 'value'.`)
    } else if (propDescriptions.length > 0 && !propDescriptions.every(obj => Object.keys(obj).indexOf('key') !== -1)) {
      err = new ValidationError(`Expected every object inside array passed to function to have a property 'key'.`)
    } else if (propDescriptions.length > 0
      && !propDescriptions.every(obj => Object.keys(obj).every(keyName => keyName === 'key' || keyName === 'value'))) {
      err = new ValidationError(`Expected every object inside array passed to function to have a property 'key'.`)
    } else if (propDescriptions.length > 0 && !propDescriptions.every(obj => typeName(obj.key) === 'string')) {
      err = new ValidationError(`Expected every object inside array passed to function to have a property 'key'.`)
    } else if (propDescriptions.length > 0
      && !propDescriptions.every(obj => typeName(obj.value) === 'string' || typeName(obj.value) === 'number')) {
      err = new ValidationError(`Expected every object inside array passed to function to have a property 'key'.`)
    }
    if (err) {
      err.path = filepath
      throw err
    }
    mapped = propDescriptions.map(mapper)
  } catch (e) {
    if (debug) {
      if (debug === 1) printError(e)
      if (log) logError(e)
    }
    throw e
  }

  return mapped.reduce(reducer, {})
}
