/**
 * @file Tests for file {@link <install_folder>/libs/validate-documents.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const validate = require('./validate-documents')
const schema = require('../schema/payday-simple-1.json')
const ValidationError = require('../errors/validation-error')

const documents = [
  {
    belopp: 2000,
    'uppl.avg': 350,
    'fakt.avg': 45,
    'ränta(kr)': 64,
    'betala-totalt': 2459,
    'eff.-ränta(%)': 1135,
    'nom.-ränta(%)': 39,
    'löptid(d)': 30,
    leverantörsId: 1
  },
  {
    belopp: 3000,
    'uppl.avg': 550,
    'fakt.avg': 45,
    'ränta(kr)': 93,
    'betala-totalt': 3688,
    'eff.-ränta(%)': 861,
    'nom.-ränta(%)': 26,
    'löptid(d)': 30,
    leverantörsId: 1
  }
]

test('validate(documents, schema)', (t) => {
  t.type(validate(documents, schema), 'boolean', `[01] Returns a boolen true when given valid arguments (where the first argument is an array of documents)`)
  t.same(validate(documents, schema), true, `[02] Returns true when given valid arguments`)
  documents[2] = { // missing required key 'belopp'
    'uppl.avg': 350,
    'fakt.avg': 45,
    'ränta(kr)': 96,
    'betala-totalt': 3491,
    'eff.-ränta(%)': 532,
    'nom.-ränta(%)': 39,
    'löptid(d)': 30,
    leverantörsId: 1
  }
  t.throws(() => validate(documents, schema), ValidationError, `[03] Throws ValidationError when missing required key for documents in first argument`)
  delete documents[2]
  t.throws(() => { validate() }, Error, `[04] Throws TypeError when called without arguments`)
  t.throws(() => { validate(undefined) }, TypeError, `[05] Throws TypeError when called with undefined as only argument`)
  t.throws(() => { validate(null) }, TypeError, `[06] Throws TypeError when called with null as only argument`)
  t.throws(() => { validate(documents, null) }, TypeError, `[07] Throws TypeError when given null as second argument`)
  t.throws(() => { validate(documents, undefined) }, TypeError, `[08] Throws TypeError when given undefined as second argument`)
  t.throws(() => { validate({ docs: documents }, schema) }, TypeError, `[09] Throws TypeError when given an object as first argument`)
  t.throws(() => { validate(() => {}, schema) }, TypeError, `[10] Throws TypeError when given a function as first argument`)
  t.throws(() => { validate('documents', schema) }, TypeError, `[11] Throws TypeError when given a string as first argument`)
  t.throws(() => { validate(31, schema) }, TypeError, `[12] Throws TypeError when given a number as first argument`)
  t.throws(() => { validate(documents, [schema]) }, TypeError, `[13] Throws TypeError when given an array as second argument`)
  t.throws(() => { validate(documents, () => {}) }, TypeError, `[14] Throws TypeError when given a function as second argument`)
  t.throws(() => { validate(documents, 'schema') }, TypeError, `[15] Throws TypeError when given a string as second argument`)
  t.throws(() => { validate(documents, 32) }, TypeError, `[16] Throws TypeError when given a number as second argument`)

  t.end()
})
