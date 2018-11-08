/**
 * @file Tests for file {@link <install_folder>/libs/validate-key-val.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const validateKeyVal = require('./validate-key-val')
const ValidationError = require('../errors/validation-error')
const schema = require('../schema/payday-simple-1.json')

test('validateKeyVal(key, value, schema)', (t) => {
  t.type(validateKeyVal('belopp', 1, schema), 'boolean', `[01] Returns a boolean when given valid arguments`)
  t.same(validateKeyVal('belopp', 2, schema), true, `[02] Returns true when given valid arguments alongside first argument "leverantörsId"`)
  t.same(validateKeyVal('belopp', 3, schema), true, `[03] Returns true when given valid arguments alongside first argument "uppl.avg"`)
  t.throws(() => { validateKeyVal('nonexisting key', 4, schema) }, ValidationError, `[04] Throws ValidationError when given key in first argument doesn't exist for given schema in 3rd argument`)
  t.throws(() => { validateKeyVal('', 5, schema) }, ValidationError, `[05] Throws ValidationError when first argument is an empty string`)
  t.throws(() => { validateKeyVal('	 ', 6, schema) }, ValidationError, `[06] Throws ValidationError when first argument consists only of white space`) // eslint-disable-line
  t.throws(() => { validateKeyVal('belopp', '7', schema) }, TypeError, `[07] Throws TypeError when second value is of wrong type for given key in first argument`)
  t.throws(() => { validateKeyVal(8, 9, schema) }, TypeError, `[08] Throws TypeError when first argument is a number instead of a string`)
  t.throws(() => { validateKeyVal() }, TypeError, `[09] Throws TypeError when called without arguments`)
  t.throws(() => { validateKeyVal(null) }, TypeError, `[10] Throws TypeError when called with null as only argument`)
  t.throws(() => { validateKeyVal('belopp', null, schema) }, TypeError, `[11] Throws TypeError when given null as second argument`)
  t.throws(() => { validateKeyVal('belopp', 10, null) }, TypeError, `[12] Throws TypeError when given null as third argument`)
  t.throws(() => { validateKeyVal('belopp') }, TypeError, `[13] Throws TypeError when called with only one argument`)
  t.throws(() => { validateKeyVal('belopp', 111) }, TypeError, `[14] Throws TypeError when called with only two arguments`)
  t.end()
})
