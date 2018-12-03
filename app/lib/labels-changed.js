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
 * PARAMETERS   Type      Name            Required  Description
 * ============================================================================================================================
 * @param       {object}  <unavailable>     yes     An object holding the labels and the map object to check
 *                 ▼
 *                 ▼
 *                 ▼
 *                 ▼        Type          Name      Required  Description
 *              =====================================================================================================================
 *              @property   {string[]}    labels      yes     The labels that are to be checked (extracted from some web page)
 *              @property   {object[]}    labelMap    yes     An array with objects where the property 'label' of every object
 *                                                            in the array contains the label that is expected to be found on the web page.
 *                                                            The order of the objects must match the order of the corresponding labels
 *                                                            found in the 'labels' array.
 *
 *
 * @return {boolean} Returns true if labels have changed, false otherwise
 */

const assert = require('assert')
const VError = require('verror')
const type = require('type-name')
const { INVALID_ARG_ERR } = require('../config/errors').errors.names

module.exports = (data) => {
  try {
    assert.strictEqual(type(data), 'Object', `argument must be an object`)
    assert.strictEqual(type(data.labels), 'Array', `property 'labels' must be an array`)
    data.labels.forEach(label => assert.strictEqual(type(label), 'string', `all items in array of property 'labels' must be strings`))
    assert.strictEqual(type(data.labelMap), 'Array', `property 'labelMap' must be an array`)
    data.labelMap.forEach((item) => {
      assert.strictEqual(type(item), 'Object', `all items in array of property 'labelMap' must be objects`)
      assert.strictEqual(type(item.label), 'string', `property 'label' in all objects of 'labelMap' array must be strings`)
    })
  } catch (err) {
    const info = { argName: 'data', argValue: data, argType: type(data), argPos: 0 }
    throw new VError({ name: INVALID_ARG_ERR, cause: err, info }, `invalid argument`)
  }

  const { labels, labelMap } = data

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
