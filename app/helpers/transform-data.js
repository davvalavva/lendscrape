/**
 * @file Transforms scraped data to documents for database storage
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

/**
 * Transforms data in a table format (array of arrays) to an array of documents (objects)
 * so that it can be stored in a document database (i.e. MongoDB)
 *
 * @module helpers/transform-data
 */

const dateTime = require('date-time')
const manualInsert = require('./manual-insert.js')

/**
 * Data in a two dimensional array get transformed to an array of objects (documents)
 * suitable for storing to a document database (i.e. MongoDB)
 * EXAMPLE CODE:
 * const before = [[10, 11, 12], [25, 26, 27], [38, 39, 40]]
 * const after = transform(before, mappings) // <-- The function this module exports
 * console.log(JSON.stringify(before, null, 2))
 * CONSOLE OUTPUT:
 * [
 *    {
 *      width: 10,
 *      height: 11,
 *      depth: 12
 *    },
 *    {
 *      width: 25,
 *      height: 26,
 *      depth: 27
 *    },
 *    {
 *      width: 38,
 *      height: 39,
 *      depth: 40
 *    }
 * ]
 *
 * The second argument to the function is an object structure (via JSON) for mapping
 * the scraped names of the data values to key names in the document object
 *
 *
 * @param {mixed[[]]} data Two dimensional array of values to be transformed documents
 * @param {object[]} headersKeysMap Data structure for mapping scraped data names
 * to key names in document objects
 * @param {mixed[[]]} manualData TODO
 * @return {object[]} Documents that now can be stored in a document database (i.e. MongoDB)
 */
module.exports = (data, headersKeysMap, manualData) => {
  const arrayToObject = (obj, val, i) => (
    {
      ...obj,
      [headersKeysMap[i].mapped]: val
    }
  )

  const manualDocument = manualInsert(manualData, dateTime)

  const transformed = data.reduce(
    (arrayOfObjects, arr) => arrayOfObjects.concat(
      [
        arr.reduce(arrayToObject, {})
      ]
    ),
    []
  ).map(document => ({ ...document, ...manualDocument }))

  return transformed
}
