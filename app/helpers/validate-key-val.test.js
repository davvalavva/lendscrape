/**
 * @file Tests for file {@link <install_folder>/helpers/validate-key-val.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const validateKeyVal = require('./validate-key-val')
const { ValidationError } = require('../config/custom-errors')
const schemas = require('../config/schemas.json')

const type = 'type-1'
const schema = schemas[type]

test('validateKeyVal(key, value, schema)', (t) => {
  t.type(validateKeyVal('belopp', 1, schema), 'boolean', `Returns a boolean when given valid arguments`)
  t.same(validateKeyVal('belopp', 2, schema), true, `Returns true when given valid arguments alongside first argument "leverantörsId"`)
  t.same(validateKeyVal('belopp', 3, schema), true, `Returns true when given valid arguments alongside first argument "uppl.avg"`)
  t.throws(() => { validateKeyVal('nonexisting key', 4, schema) }, ValidationError, `Throws ValidationError when given key in first argument doesn't exist for given schema in 3rd argument`)
  t.throws(() => { validateKeyVal('', 5, schema) }, ValidationError, `Throws ValidationError when first argument is an empty string`)
  t.throws(() => { validateKeyVal('	 ', 6, schema) }, ValidationError, `Throws ValidationError when first argument consists only of white space`) // eslint-disable-line
  t.throws(() => { validateKeyVal('belopp', '7', schema) }, TypeError, `Throws TypeError when second value is of wrong type for given key in first argument`)
  t.throws(() => { validateKeyVal(8, 9, schema) }, TypeError, `Throws TypeError when first argument is a number instead of a string`)
  t.throws(() => { validateKeyVal() }, ReferenceError, `Throws ReferenceError when called without arguments`)
  t.throws(() => { validateKeyVal(null) }, ReferenceError, `Throws ReferenceError when called with null as only argument`)
  t.throws(() => { validateKeyVal('belopp', null, schema) }, ReferenceError, `Throws ReferenceError when given null as second argument`)
  t.throws(() => { validateKeyVal('belopp', 10, null) }, ReferenceError, `Throws ReferenceError when given null as third argument`)
  t.throws(() => { validateKeyVal('belopp') }, ReferenceError, `Throws ReferenceError when called with only one argument`)
  t.throws(() => { validateKeyVal('belopp', 111) }, ReferenceError, `Throws ReferenceError when called with only two arguments`)
  t.end()
})
