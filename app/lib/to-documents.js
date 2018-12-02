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
 *                @property   {object[]}    labelMap      yes     An array of objects having two properties 'label' and 'field'.
 *                                                                The order is the objects correlates to the order of the values
 *                                                                in each array inside the 'rows' argument.
 *
 *                @property   {object}      fieldInject   no      An optional object with additional key value pairs to add
 *                                                                to each object returned in the array. Key names that exists
 *                                                                in 'field' property of 'labelMap' are not allowed.
 *
 *
 * @return {object[]} Returns an array of objects containing the data passed in the 'rows' property in the object passed to the function.
 */
/* eslint-enable max-len */

const typeName = require('type-name')

const valueToObject = (acc, val, index, row) => {
  const { field } = acc.labelMap[index]

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

module.exports = ({ rows, labelMap, fieldInject } = {}) => {
  if (rows && rows.length === 0) throw new TypeError(`Property 'rows' can't be an empty array`)
  if (labelMap && labelMap.length === 0) throw new TypeError(`Property 'labelMap' can't be an empty array`)
  if (fieldInject !== undefined && typeName(fieldInject) !== 'Object') throw new TypeError(`Property 'fieldInject' must be an object if given, found type '${typeName(fieldInject)}'`)

  if (typeName(fieldInject) === 'Object') {
    const overwrites = !Object.keys(fieldInject)
      .every(injectKey => labelMap
        .every(map => map.field.toLowerCase() !== injectKey.toLowerCase()))

    if (overwrites) throw new RangeError(`Injected field can not have the same name as a scraped field`)

    return docsFrom(rows, labelMap).map(document => ({ ...document, ...fieldInject }))
  }

  return docsFrom(rows, labelMap)
}
