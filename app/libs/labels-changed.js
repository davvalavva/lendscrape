/** @module libs/labels-changed */

/**
 * Checks that strings matches expected values given in the object map passed
 * as second argument.
 *
 * @param {string[]} labels The labels scraped from the web page
 * @param {object[]} labelMap An array with objects mapping headernames from web page
 * to corresponding keynames for the documents in database
 * @return {boolean} Returns true if labels have changed, false otherwise
 */
module.exports = (labels, labelMap) => {
  const clean = str => str.trim().toLowerCase()
  if (!labels.every(
    (element, i) => clean(element) === clean(labelMap[i].label)
  )) {
    return true
  }
  return false
}
