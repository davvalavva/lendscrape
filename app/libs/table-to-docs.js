/** @module libs/table-to-docs */

/* eslint-disable max-len */
/**
 * @function
 * To explain how this function works I'll illustrate by showing the data structures given as arguments and the
 * data structure returned.
 *
 * FIRST ARGUMENT ('rows')
 * [
 *    [2000, 350, 45, 64, 2459],
 *    [3000, 350, 45, 96, 3491]
 * ]
 * // SECOND ARGUMENT ('labelMap')
 * [
 *    { "key": "Belopp",     "field": "belopp"        },
 *    { "key": "Uppl. avg",  "field": "uppl.avg"      },
 *    { "key": "Fakt. avg",  "field": "fakt.avg"      },
 *    { "key": "Ränta",      "field": "ränta(kr)"     },
 *    { "key": "Total",      "field": "betala-totalt" },
 * ]
 * // RETURNED
 * [
 *  {
 *    "belopp": 2000,
 *    "uppl.avg": 350,
 *    "fakt.avg": 45,
 *    "ränta(kr)": 64,
 *    "betala-totalt": 2459
 *  },
 *  {
 *    "belopp": 3000,
 *    "uppl.avg": 350,
 *    "fakt.avg": 45,
 *    "ränta(kr)": 96,
 *    "betala-totalt": 3491
 *  }
 * ]
 *
 * PARAMETERS:
 * in order   Type          Name    Required  Description
 * ============================================================================================================================
 * @param     {Number[[]]}  rows    yes       An array of arrays with numbers which will become the
 *                                            property values in the objects that are returned in an array.
 *
 * @param     {Object[]}    labelMap  yes       An array of objects having two properties 'key' and 'field'. The order
 *                                            is the objects correlates to the order of the values in each array inside
 *                                            the 'rows' argument.
 *
 * RETURNS:
 * @return {Object[]} Returns an array of objects containing the data passed in the 'rows' argument
 */
/* eslint-enable max-len */

const path = require('path')
const typeName = require('type-name')
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

/**
 * @param {Object} acc
 * @param {Number} val
 * @param {Number} index
 * @param {Number[]} row
 */
const valueToObject = (acc, val, index, row) => {
  const { field } = acc.labelMap[index]

  // Before return the object after last element have been traversed,
  // get rid of the labelMap that was passed from the calling reduce function.
  if (index === row.length - 1) {
    delete acc.labelMap
  }
  return {
    ...acc,
    [field]: val
  }
}

const docsFrom = (rows, labelMap) => {
  const rowToDoc = row => row.reduce(valueToObject, { labelMap })

  return rows.map(row => rowToDoc(row))
}

module.exports = (data) => {
  let rows
  let labelMap
  try {
    let err
    if (data === undefined) {
      err = new ReferenceError(`Missing required argument! Expected an object.`)
    } else if (typeName(data) !== 'Object') {
      err = new TypeError(`Expected an object as argument, found type '${typeName(data)}'`)
    } else if (data.rows === undefined) {
      err = new ReferenceError(`Missing property 'rows' in object passed to function.`)
    } else if (data.labelMap === undefined) {
      err = new ReferenceError(`Missing property 'labelMap' in object passed to function.`)
    } else if (typeName(data.rows) !== 'Array') {
      err = new TypeError(`Property 'rows' in object passed to function must be an array, found type '${typeName(data.rows)}'`)
    } else if (data.rows.length === 0) {
      err = new ValidationError(`Property 'rows' of array in object passed to function can't be empty`)
    } else if (!data.rows.every(row => typeName(row) === 'Array')) {
      err = new TypeError(`Property 'rows' of array in object passed to function must only contain arrays`)
    } else if (typeName(data.labelMap) !== 'Array') {
      err = new TypeError(`Property 'labelMap' in object passed to function must be an array, found type '${typeName(data.labelMap)}'`)
    } else if (data.labelMap.length === 0) {
      err = new ValidationError(`Property 'labelMap' of array in object passed to function can't be empty`)
    } else if (!data.labelMap.every(obj => typeName(obj) === 'Object')) {
      err = new TypeError(`Property 'labelMap' of array in object passed to function must only contain objects`)
    } else if (!data.labelMap.every(obj => obj.field !== undefined)) {
      err = new ReferenceError(`All objects found in array of property 'labelMap' of array in object passed to function must have a property 'field'`)
    } else if (!data.labelMap.every(obj => typeName(obj.field) === 'string')) {
      err = new TypeError(`Property 'field' of objects found in array of property 'labelMap' of array in object passed to function must be of type 'string'`)
    }
    if (!err) {
      ({ rows, labelMap } = data)
    } else {
      err.signature = 'function(data)'
      err.args = [
        {
          position: 0, required: true, expectedType: 'object', foundType: typeName(data), foundValue: data
        }
      ]
      err.path = filepath
      throw err
    }
  } catch (e) {
    if (debug) {
      if (debug === 1) printError(e)
      if (log) logError(e)
    }
    throw e
  }

  return docsFrom(rows, labelMap)
}
