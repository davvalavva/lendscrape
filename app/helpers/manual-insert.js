/**
 * @file Transforms array of objects to one object
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson <david.jonsson@pm.me>
 */

/**
 * Creates an object with manually entered values (as opposed to scraped ones)
 * to be merged with objects (documents) being prepared for database storage
 *
 * @module helpers/manual-insert
 */

/**
 * Creates an object with manually entered values (as opposed to scraped ones)
 * to be merged with objects (documents) that are being prepared for database storage
 *
 * @param {object[]} props - Objects containing keynames and values to be merged
 * with the objects (documents) being prepared for database storage
 * @param {function} dateTime - Dependency injected function that is expected to return a
 * timestamp string with the following format "YYYY-MM-DD HH:MM:SS TZ"
 * where TZ is the timezone, for example "UTC+1".
 * @return {object} An object containing the manually entered values that are to be merged
 * with the objects (documents) being prepared for database storage
 */
module.exports = (props, dateTime) => {
  const mapped = props.map(
    (obj) => {
      let val = obj.value
      if (obj.value === 'now()') {
        val = dateTime({ showTimeZone: true })
      }
      return { [obj.key]: val }
    }
  )
  return mapped.reduce((accObj, currObj) => ({ ...accObj, ...currObj }), {})
}
