const { test } = require('tap')
const validateDoc = require('../lib/validate-document')
const ValidationError = require('../errors/validation-error')

const schema = JSON.parse(`{
  "leverantörsId": { "required": true,  "BSON": "int" },
  "belopp":        { "required": true,  "BSON": "int" },
  "uppl.avg":      { "required": false, "BSON": "int" },
  "fakt.avg":      { "required": false, "BSON": "int" },
  "ränta(kr)":     { "required": false, "BSON": "int" },
  "betala-totalt": { "required": false, "BSON": "int" },
  "eff.-ränta(%)": { "required": false, "BSON": "int" },
  "nom.-ränta(%)": { "required": false, "BSON": "int" },
  "löptid(d)":     { "required": true,  "BSON": "int" }
}`)

const document = JSON.parse(`{
  "belopp":        2000,
  "uppl.avg":      350,
  "fakt.avg":      45,
  "ränta(kr)":     64,
  "betala-totalt": 2459,
  "eff.-ränta(%)": 1135,
  "nom.-ränta(%)": 39,
  "löptid(d)":     30,
  "leverantörsId": 1
}`)

test('validateDoc(document, schema)', (t) => {
  t.type(validateDoc(document, schema), 'boolean', `[01] Returns a boolen true when given valid arguments (where the 1st argument is an array of document)`)
  t.same(validateDoc(document, schema), true, `[02] Returns true when given valid arguments`)
  t.throws(() => { validateDoc(undefined) }, ReferenceError, `[03] Throws ReferenceError when called without any arguments`)
  t.throws(() => { validateDoc(null, schema) }, TypeError, `[04] Throws TypeError when 1st argument is null`)
  t.throws(() => { validateDoc([], schema) }, TypeError, `[05] Throws TypeError when 1st argument is an array`)
  t.throws(() => { validateDoc(() => {}, schema) }, TypeError, `[06] Throws TypeError when 1st argument is a function`)
  t.throws(() => { validateDoc('document', schema) }, TypeError, `[07] Throws TypeError when 1st argument is a string`)
  t.throws(() => { validateDoc(31, schema) }, TypeError, `[08] Throws TypeError when 1st argument is a number`)
  t.throws(() => { validateDoc(document) }, ReferenceError, `[09] Throws ReferenceError when called without 2nd argument`)
  t.throws(() => { validateDoc(document, null) }, TypeError, `[10] Throws TypeError when 2nd argument is null`)
  t.throws(() => { validateDoc(document, [schema]) }, TypeError, `[11] Throws TypeError when 2nd argument is an array`)
  t.throws(() => { validateDoc(document, () => {}) }, TypeError, `[12] Throws TypeError when 2nd argument is a function`)
  t.throws(() => { validateDoc(document, 'schema') }, TypeError, `[13] Throws TypeError when 2nd argument is a string`)
  t.throws(() => { validateDoc(document, 32) }, TypeError, `[14] Throws TypeError when 2nd argument is a number`)
  const faultyDoc = { ...document }
  delete faultyDoc.belopp
  t.throws(() => validateDoc(faultyDoc, schema), ValidationError, `[15] Throws ValidationError when missing a required property for object given in 1st argument`)
  t.throws(
    () => validateDoc(null, schema, { debug: 1, log: false }),
    TypeError,
    `[16] validateDoc(null, schema, { debug: 1, log: false }) throws TypeError (and should output error to terminal but no log error)`
  )
  t.throws(
    () => validateDoc(null, schema, { debug: 1, log: true }),
    TypeError,
    `[17] validateDoc(null, schema, { debug: 1, log: true }) throws TypeError (and should output error to terminal and log error)`
  )
  t.throws(
    () => validateDoc(null, schema, { debug: 0, log: true }),
    TypeError,
    `[18] validateDoc(null, schema, { debug: 0, log: true }) throws TypeError (and should log error but not output error to terminal)`
  )

  t.end()
})
