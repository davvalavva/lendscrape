/** @module libs/validate-key-val */

const path = require('path')
const typeName = require('type-name')
const ValidationError = require('../errors/validation-error')
const printError = require('../errors/print-error')
const logError = require('./log-error')
const map = require('../schema/BSON-JS-map.json')
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

module.exports = (key, value, schema) => {
  try {
    let err
    let expectedType
    if (key === undefined || value === undefined || schema === undefined) {
      err = new ReferenceError(`Missing arguments given for function, expected 3 arguments`)
    } else if (typeName(key) !== 'string') {
      err = new TypeError(`Expected a string as first argument`)
    } else if (typeName(schema) !== 'Object') {
      err = new TypeError(`Expected an object as third argument`)
    } else if (['string', 'number', 'Array'].indexOf(typeName(value)) === -1) {
      err = new TypeError(`Expected a string, number or an array as second argument`)
    } else if (!schema[key] || schema[key] == null || schema[key] === 0 || schema[key] === '') {
      err = new ValidationError('Key given as first argument does not exist in schema given in 3rd argument')
    }
    if (!err) {
      const expectedBSON = schema[key].BSON
      expectedType = map[expectedBSON]
      if (typeName(value) !== expectedType) {
        err = new ValidationError(`Type of value given in second argument doesn't match type in schema given in 3rd argument`)
      } else if (expectedBSON === 'int' && typeName(value) === 'number' && !Number.isInteger(value)) {
        err = new ValidationError(`Expected 'value' in 2nd arg. to be an integer (no decimals)`)
      } else if (typeName(value) === 'Array') {
        const expectedElBSON = schema[key]['elements-BSON']
        const expectedElType = map[expectedElBSON]
        let faultyValue = value.find(el => typeName(el) !== expectedElType)
        if (faultyValue !== undefined) {
          err = new ValidationError(`Expected every element in array given in 2nd arg. 'value' to be of type ${expectedElType}`)
        } else if (expectedElBSON === 'int') {
          faultyValue = value.find(el => !Number.isInteger(el))
          if (faultyValue !== undefined) {
            err = new ValidationError(`Expected all values in 'value' in 2nd arg. to be integers (no decimals)`)
          }
        }
      }
    }
    if (err) {
      err.signature = 'function(key, value, schema)'
      err.args = [
        {
          position: 0, required: true, expectedType: 'string', foundType: typeName(key), foundValue: key
        },
        {
          position: 1, required: true, expectedType: expectedType || 'string|number|Array', foundType: typeName(value), foundValue: value
        },
        {
          position: 2, required: true, expectedType: 'Object', foundType: typeName(schema), foundValue: schema
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
  return true
}
