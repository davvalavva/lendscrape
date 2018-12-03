/** @module lib/to-documents */

/* eslint-disable max-len */
/**
 * @function
 * To understand how this function works see the example below of how data structures given as properties
 * in the object passed gets restructured before returned.
 *
 * Given property 'rows' with following values (array of arrays):
 * [
 *    [2000, 350, 45, 64, 2459],
 *    [3000, 350, 45, 96, 3491]
 * ]
 *
 * ... and property 'labelMap' with following values (array of objects):
 * [
 *    { "key": "Belopp",     "field": "belopp"        },
 *    { "key": "Uppl. avg",  "field": "uppl.avg"      },
 *    { "key": "Fakt. avg",  "field": "fakt.avg"      },
 *    { "key": "Ränta",      "field": "ränta(kr)"     },
 *    { "key": "Total",      "field": "betala-totalt" },
 * ]
 *
 * ... and also the optional property fieldInject:
 * {
 *    "providerId": 14
 * }
 *
 * ... the function returns the following array
 * [
 *  {
 *    "belopp": 2000,
 *    "uppl.avg": 350,
 *    "fakt.avg": 45,
 *    "ränta(kr)": 64,
 *    "betala-totalt": 2459,
 *    "providerId": 14
 *  },
 *  {
 *    "belopp": 3000,
 *    "uppl.avg": 350,
 *    "fakt.avg": 45,
 *    "ränta(kr)": 96,
 *    "betala-totalt": 3491,
 *    "providerId": 14
 *  }
 * ]
 *
 * PARAMETERS     Type      Name            Required  Description
 * ============================================================================================================================
 * @param         {object}  <unavailable>     yes     An object holding the data and it's associated map needed for
 *                   ▼                                the creation of the array of objects (documents) to be returned.
 *                   ▼
 *                   ▼
 *                   ▼        Type          Name        Required  Description
 *                =============================================================================================================
 *                @property   {number[[]]}  rows          yes     An array of arrays with numbers which will become the
 *                                                                property values in the objects that are returned in an array.
 *
 *                @property   {object[]}    labelMap      yes     An array of objects having the required property 'field', and
 *                                                                where any other property is allowed (i.e. 'label') but ignored.
 *                                                                The order of the objects in the array correlates to the order
 *                                                                of the values in the arrays inside the 'rows' argument.
 *
 *                @property   {object}      fieldInject   no      An optional object with additional key value pairs to add
 *                                                                to each object returned in the array. Key names that exists
 *                                                                in 'field' property of 'labelMap' are not allowed.
 *
 *
 * @return {object[]} Returns an array of objects containing the data passed in the 'rows' property in the object passed to the function.
 */
/* eslint-enable max-len */

const assert = require('assert')
const VError = require('verror')
const type = require('type-name')
const { INVALID_ARG_ERR } = require('../config/errors').errors.names

const valueToObject = (acc, val, index, row) => {
  const { field } = acc.labelMap[index]

  if (index === row.length - 1) delete acc.labelMap

  return { ...acc, [field]: val }
}

const docsFrom = (rows, labelMap) => {
  const rowToDoc = row => row.reduce(valueToObject, { labelMap })

  return rows.map(row => rowToDoc(row))
}

module.exports = (data) => {
  try {
    assert.strictEqual(type(data), 'Object', `argument must be an object`)
    assert.strictEqual(type(data.rows), 'Array', `property 'rows' must be an array`)
    assert.ok(type(data.rows.length) === 'number' && data.rows.length > 0, `array of property 'rows' must not be empty`)
    assert.strictEqual(type(data.labelMap), 'Array', `property 'labelMap' must be an array`)
    assert.ok(type(data.labelMap.length) === 'number' && data.labelMap.length > 0, `array of property 'labelMap' must not be empty`)
    assert.ok(type(data.fieldInject) === 'undefined' || type(data.fieldInject) === 'Object', `if set, property 'fieldInject' must be an object`)
    data.rows.forEach((row) => {
      assert.strictEqual(type(row), 'Array', `all items in array of property 'rows' must be arrays`)
      row.forEach(val => assert.strictEqual(type(val), 'number', `all items in array of arrays of property 'rows' must be numbers`))
    })
    data.labelMap.forEach((obj) => {
      assert.strictEqual(type(obj), 'Object', `all items in array of property 'labelMap' must be objects`)
      assert.strictEqual(type(obj.field), 'string', `all 'field' properties of objects in 'labelMap' must have a string value`)
    })
  } catch (err) {
    const info = { argName: 'data', argValue: data, argType: type(data), argPos: 0 }
    throw new VError({ name: INVALID_ARG_ERR, cause: err, info }, `invalid argument`)
  }

  const { rows, labelMap, fieldInject } = data

  if (type(fieldInject) === 'Object') {
    const overwrites = !Object.keys(fieldInject)
      .every(injectKey => labelMap
        .every(map => map.field.toLowerCase() !== injectKey.toLowerCase()))

    if (overwrites) {
      const info = { argName: 'data', argValue: data, argType: type(data), argPos: 0 }
      throw new VError({ name: INVALID_ARG_ERR, info }, `invalid argument: Injected field name already exists as scraped field name`)
    }

    return docsFrom(rows, labelMap).map(document => ({ ...document, ...fieldInject }))
  }

  return docsFrom(rows, labelMap)
}
