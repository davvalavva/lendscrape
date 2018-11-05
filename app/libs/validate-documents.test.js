/**
 * @file Tests for file {@link <install_folder>/libs/validate-documents.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const validate = require('./validate-documents')
const schemas = require('../config/schemas.json')
const ValidationError = require('../errors/validation-error')
const XTypeError = require('../errors/xtype-error')

const schema = schemas['type-1']
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
  t.throws(() => { validate() }, Error, `[04] Throws XTypeError when called without arguments`)
  t.throws(() => { validate(undefined) }, XTypeError, `[05] Throws XTypeError when called with undefined as only argument`)
  t.throws(() => { validate(null) }, XTypeError, `[06] Throws XTypeError when called with null as only argument`)
  t.throws(() => { validate(documents, null) }, XTypeError, `[07] Throws XTypeError when given null as second argument`)
  t.throws(() => { validate(documents, undefined) }, XTypeError, `[08] Throws XTypeError when given undefined as second argument`)
  t.throws(() => { validate({ docs: documents }, schema) }, XTypeError, `[09] Throws XTypeError when given an object as first argument`)
  t.throws(() => { validate(() => {}, schema) }, XTypeError, `[10] Throws XTypeError when given a function as first argument`)
  t.throws(() => { validate('documents', schema) }, XTypeError, `[11] Throws XTypeError when given a string as first argument`)
  t.throws(() => { validate(31, schema) }, XTypeError, `[12] Throws XTypeError when given a number as first argument`)
  t.throws(() => { validate(documents, [schema]) }, XTypeError, `[13] Throws XTypeError when given an array as second argument`)
  t.throws(() => { validate(documents, () => {}) }, XTypeError, `[14] Throws XTypeError when given a function as second argument`)
  t.throws(() => { validate(documents, 'schema') }, XTypeError, `[15] Throws XTypeError when given a string as second argument`)
  t.throws(() => { validate(documents, 32) }, XTypeError, `[16] Throws XTypeError when given a number as second argument`)

  t.end()
})
