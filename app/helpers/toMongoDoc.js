/**
 * Transforms data in a table format (array of arrays) to an array of documents (objects)
 * so that it can be stored in a document database (i.e. MongoDB)
 *
 * @module helpers/toMongoDoc
 */

const dateTime = require('date-time')
const manualVals = require('./manualVals.js')

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
 * @param {mixed[[]]} tableData Two dimensional array of values to be transformed documents
 * @param {object} mappings Data structure for mapping scraped data names
 * to key names in document objects
 * @return {object[]} Documents that now can be stored in a document database (i.e. MongoDB)
 */
module.exports = (tableData, mappings) => {
  const arrValsToOneObj = (obj, val, i) => (
    { ...obj, [mappings.scraped[i].mapped]: val }
  )
  const manVals = manualVals(mappings.manual, dateTime)
  const transformed = tableData.reduce(
    (arrOfObjects, arr) => arrOfObjects
      .concat(
        [arr.reduce(arrValsToOneObj, {})]
      ), []
  ).map(document => ({ ...document, ...manVals }))

  return transformed
}
