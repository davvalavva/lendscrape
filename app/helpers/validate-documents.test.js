/**
 * @file Tests for file {@link <install_folder>/helpers/validate-documents.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson <david.jonsson@pm.me>
 */

const { test } = require('tap')
const validateMongoDoc = require('./validate-documents')
const schemas = require('../config/schemas.json')
const { ValidationError } = require('./custom-errors')

const schema = schemas['type-1']
const mongoDocs = [
  {
    belopp: 2000,
    'uppl.avg': 350,
    'fakt.avg': 45,
    'ränta (kr)': 64,
    'betala totalt': 2459,
    'eff. ränta (%)': 1135,
    'nom. ränta (%)': 39,
    'löptid (d)': 30,
    leverantörsId: 1,
    'senaste kontroll': '2018-10-31 08:01:13 UTC+1',
    'senaste ändring': '2018-10-30 18:58:18 UTC+1'
  },
  {
    belopp: 3000,
    'uppl.avg': 550,
    'fakt.avg': 45,
    'ränta (kr)': 93,
    'betala totalt': 3688,
    'eff. ränta (%)': 861,
    'nom. ränta (%)': 26,
    'löptid (d)': 30,
    leverantörsId: 1,
    'senaste kontroll': '2018-10-31 08:01:13 UTC+1',
    'senaste ändring': '2018-10-30 18:58:18 UTC+1'
  }
]

test('validateMongoDoc(mongoDocs, schema)', (t) => {
  t.type(validateMongoDoc(mongoDocs, schema), 'boolean', `Returns a boolen true when given valid arguments (where the first argument is an array of documents)`)
  t.same(validateMongoDoc(mongoDocs, schema), true, `Returns true when given valid arguments`)
  mongoDocs[2] = { // missing mandatory key 'belopp'
    'uppl.avg': 350,
    'fakt.avg': 45,
    'ränta (kr)': 96,
    'betala totalt': 3491,
    'eff. ränta (%)': 532,
    'nom. ränta (%)': 39,
    'löptid (d)': 30,
    leverantörsId: 1
  }
  t.throws(() => validateMongoDoc(mongoDocs, schema), ValidationError, `Throws ValidationError when missing mandatory key for documents in first argument`)
  delete mongoDocs[2]
  t.throws(() => { validateMongoDoc() }, ReferenceError, `Throws ReferenceError when called without arguments`)
  t.throws(() => { validateMongoDoc(undefined) }, ReferenceError, `Throws ReferenceError when called with undefined as only argument`)
  t.throws(() => { validateMongoDoc(null) }, ReferenceError, `Throws ReferenceError when called with null as only argument`)
  t.throws(() => { validateMongoDoc(mongoDocs, null) }, ReferenceError, `Throws ReferenceError when given null as second argument`)
  t.throws(() => { validateMongoDoc(mongoDocs, undefined) }, ReferenceError, `Throws ReferenceError when given undefined as second argument`)
  t.throws(() => { validateMongoDoc({ docs: mongoDocs }, schema) }, TypeError, `Throws TypeError when given an object as first argument`)
  t.throws(() => { validateMongoDoc(() => {}, schema) }, TypeError, `Throws TypeError when given a function as first argument`)
  t.throws(() => { validateMongoDoc('mongoDocs', schema) }, TypeError, `Throws TypeError when given a string as first argument`)
  t.throws(() => { validateMongoDoc(31, schema) }, TypeError, `Throws TypeError when given a number as first argument`)
  t.throws(() => { validateMongoDoc(mongoDocs, [schema]) }, TypeError, `Throws TypeError when given an array as second argument`)
  t.throws(() => { validateMongoDoc(mongoDocs, () => {}) }, TypeError, `Throws TypeError when given a function as second argument`)
  t.throws(() => { validateMongoDoc(mongoDocs, 'schema') }, TypeError, `Throws TypeError when given a string as second argument`)
  t.throws(() => { validateMongoDoc(mongoDocs, 32) }, TypeError, `Throws TypeError when given a number as second argument`)

  t.end()
})
