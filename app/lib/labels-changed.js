/** @module lib/labels-changed */

const typeName = require('type-name')

/**
 * Checks that strings matches expected values given in the object map passed
 * as second argument.
 *
 * @param {string[]} labels The labels scraped from the web page
 * @param {object[]} labelMap An array with objects where the property label in each object
 * in the array contains the label that is expected to be found on the web page.
 * @return {boolean} Returns true if labels have changed, false otherwise
 */
module.exports = (labels, labelMap) => {
  if (typeName(labels) !== 'Array' || !labels.every(label => typeName(label) === 'string')) {
    throw TypeError(`Expected first argument to be an array of (only) strings`)
  }
  if (typeName(labelMap) !== 'Array' || !labelMap.every(item => typeName(item.label) === 'string')) {
    throw TypeError(`Expected second argument to be an array of objects where every object having a property 'label' (with a string value)`)
  }

  const clean = str => str.trim().toLowerCase()
  if (labels.length !== labelMap.length) {
    return true
  }
  if (!labelMap.every(
    (item, i) => clean(item.label) === clean(labels[i])
  )) {
    return true
  }

  return false
}
