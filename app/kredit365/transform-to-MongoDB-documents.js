const dateTime = require('date-time')
const mappings = require('./mappings.json')
const schema = require('../schemas/type-1.json')
const customValMap = require('../helpers/customValMap.js')
const validate = require('../validate-before-save')

// Ej skrapad tabelldata som ska läggas till i varje 'document'-objekt som sparas i databasen.
/*
const customValues = mappings.keys.custom
  .map((obj) => {
    const val = obj.value === 'now()' ? dateTime({ showTimeZone: true }) : obj.value
    return { [obj.mappedKeyName]: val }
  })
  .reduce((accObj, currObj) => ({ ...accObj, ...currObj }), {})
*/
const customValues = customValMap('type-1', mappings.keys.custom, dateTime)

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
