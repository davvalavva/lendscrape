/**
 * TODO Add description
 *
 * @module helpers/toMongoDoc
 */

const dateTime = require('date-time')
const manualVals = require('./manualVals.js')

/**
 * TODO Add explanation
 *
 * @param {mixed[[]]} tableData TODO Add explanation
 * @param {object} mappings TODO Add explanation
 * @return {object[]} TODO Add explanation
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
