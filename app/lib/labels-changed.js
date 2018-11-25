/** @module lib/labels-changed */

/* eslint-disable max-len */
/**
 * @function
 * This function is useful for detecting when labels, such as table headers, have changed in a web
 * page. If changed there is a big risk that the associated data value doesn't represent same thing
 * as before either, which would lead to wrong data being stored in the database.
 * The function checks that the strings of the labels (extracted from a web page) matches what is
 * expected from before (by passing an object holding the expected labels).
 *
 * PARAMETERS   Type      Name  Required  Description
 * ============================================================================================================================
 * @param       {Object}  {}    yes       An object holding the labels and the map object to check
 *                 ▼
 *                 ▼
 *                 ▼
 *                 ▼        Type          Name      Required  Description
 *              =====================================================================================================================
 *              @property   {string[]}    labels    yes       The labels that are to be checked (extracted from some web page)
 *              @property   {object[]}    labelMap  yes       An array with objects where the property label of every object
 *                                                            in the array contains the label that is expected to be found on the web page.
 *                                                            The order of the objects must match the order of the corresponding labels
 *                                                            found in the 'labels' array.
 *
 *
 * @return {boolean} Returns true if labels have changed, false otherwise
 */

const typeName = require('type-name')

module.exports = ({ labels, labelMap }) => {
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
