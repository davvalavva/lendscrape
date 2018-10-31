const dateTime = require('date-time')
const mappings = require('./mappings.json')
const schema = require('../schemas/type-1.json')
const manualVals = require('../helpers/manualVals.js')
const validate = require('../validate-before-save')

// Ej skrapad tabelldata som ska läggas till i varje 'document'-objekt som sparas i databasen.
const customValues = manualVals(mappings.keys.custom, dateTime)

// Omvandla array med flera värden till ett objekt med flera nycklar och värden
const arrValsToOneObj = (obj, val, i) => ({ ...obj, [mappings.keys.scraped[i].mappedKeyName]: val })

module.exports = (tableData) => {
  const transformed = tableData.reduce(
    (arrayOfObjects, arr) => arrayOfObjects
      .concat(
        [arr.reduce(arrValsToOneObj, {})] // Omslutande klammrar eftersom ett objekt returneras
      ), []
  ).map(document => ({ ...document, ...customValues }))

  try {
    validate(transformed, schema)
  } catch (error) {
    throw error
  }

  return transformed
}
