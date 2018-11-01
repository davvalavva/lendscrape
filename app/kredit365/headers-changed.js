/**
 * @file Verifies that data headers haven't beens changed in target
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson <david.jonsson@pm.me>
 */

/**
 * Verifies that data headers haven't beens changed in target
 *
 * @param {string[]} headers The headers scraped from the web page
 * @param {object[]} map An array with objects mapping headernames from web page
 * to corresponding names for the documents stored in database
 * @return {boolean} Returns true if headers haven't changed, false otherwise
 */
module.exports = (headers, map) => {
  const clean = str => str.trim().toLowerCase()
  if (!headers.every(
    (element, i) => clean(element) === clean(map[i].key)
  )) {
    return true
  }
  return false
}
