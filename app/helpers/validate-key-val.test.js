/**
 * @file Tests for file {@link <install_folder>/helpers/validate-key-val.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson <david.jonsson@pm.me>
 */

const { test } = require('tap')
const validateKeyVal = require('./validate-key-val')
const { ValidationError } = require('./custom-errors')
const schemas = require('../config/schemas.json')

const type = 'type-1'
const schema = schemas[type]

test('validateKeyVal(key, value, schema)', (t) => {
  t.type(validateKeyVal('leverantörsId', 1, schema), 'boolean', `Returns a boolean when given valid arguments`)
  t.same(validateKeyVal('leverantörsId', 1, schema), true, `Returns true when given valid arguments alongside first argument "leverantörsId"`)
  t.same(validateKeyVal('uppl.avg', 50, schema), true, `Returns true when given valid arguments alongside first argument "uppl.avg"`)
  t.same(validateKeyVal('senaste kontroll', '2018-01-13 12:38:11 UTC+1', schema), true, `Returns true when given valid arguments alongside first argument "senaste kontroll"`)
  t.throws(() => { validateKeyVal('nonexisting key', 1, schema) }, ValidationError, `Throws ValidationError when given key in first argument doesn't exist for given schema in 3rd argument`)
  t.throws(() => { validateKeyVal('', '2018-01-13 12:38:11 UTC+1', schema) }, ValidationError, `Throws ValidationError when first argument is an empty string`)
  t.throws(() => { validateKeyVal('	 ', '2018-01-13 12:38:11 UTC+1', schema) }, ValidationError, `Throws ValidationError when first argument consists only of white space`) // eslint-disable-line
  t.throws(() => { validateKeyVal('senaste kontroll', '2018-01-13 12:38:11', schema) }, ValidationError, `Throws ValidationError when wrong format given for value in second argument`)
  t.throws(() => { validateKeyVal('senaste kontroll', 12, schema) }, TypeError, `Throws TypeError when second value is of wrong type for given key in first argument`)
  t.throws(() => { validateKeyVal(44, '2018-01-13 12:38:11 UTC+1', schema) }, TypeError, `Throws TypeError when first argument is a number instead of a string`)
  t.throws(() => { validateKeyVal() }, ReferenceError, `Throws ReferenceError when called without arguments`)
  t.throws(() => { validateKeyVal(null) }, ReferenceError, `Throws ReferenceError when called with null as only argument`)
  t.throws(() => { validateKeyVal('senaste kontroll', null, schema) }, ReferenceError, `Throws ReferenceError when given null as second argument`)
  t.throws(() => { validateKeyVal('senaste kontroll', '2018-01-13 12:38:11 UTC+1', null) }, ReferenceError, `Throws ReferenceError when given null as third argument`)
  t.throws(() => { validateKeyVal('senaste kontroll') }, ReferenceError, `Throws ReferenceError when called with only one argument`)
  t.throws(() => { validateKeyVal('senaste kontroll', '2018-01-13 12:38:11') }, ReferenceError, `Throws ReferenceError when called with only two arguments`)
  t.end()
})
