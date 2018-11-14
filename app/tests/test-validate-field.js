const { test } = require('tap')
const validateField = require('../lib/validate-field')
const ValidationError = require('../errors/validation-error')

const json = `
{
  "leverantörsId":  { "required": true,  "BSON": "int"    },
  "uppl.avg":       { "required": true,  "BSON": "int"    },
  "valuta":         { "required": true,  "BSON": "string" },
  "belopp":         { "required": true,  "BSON": "array", "elements-BSON": "int" },
  "veckodagar":     { "required": true,  "BSON": "array", "elements-BSON": "string" },
  "årsränta":       { "required": true,  "BSON": "array", "elements-BSON": "double" },
  "eff.-ränta(%)":  { "required": false, "BSON": "int"    },
  "statsränta":     { "required": false, "BSON": "double" },
  "":               { "required": false, "BSON": "int"    },
  "   ":            { "required": false, "BSON": "int"    }
}`

// about empty and whitespace keys: It's not responsibility of this function
// to set the rules of how a schema may be configured, just that the rules
// have been adhered to by the data. If that functionality is needed,
// either write a new module or use schema feature in MongoDB

const schema = JSON.parse(json)

test('validateField(key, value, schema)', (t) => {
  t.type(validateField('leverantörsId', 1, schema), 'boolean', `[01] Returns a boolean when given arguments in a correct way`)
  t.same(validateField('uppl.avg', 2, schema), true, `[02] Returns true when given arguments in a correct way`)
  t.throws(() => { validateField() }, ReferenceError, `[03] Throws ReferenceError when called without arguments`)
  t.throws(() => { validateField(null, 4, schema) }, TypeError, `[04] Throws TypeError when value of 1st arg. ('key') is null`)
  t.throws(() => { validateField(12, 4, schema) }, TypeError, `[05] Throws TypeError when value of 1st arg. ('key') is a number`)
  t.throws(() => { validateField([], 4, schema) }, TypeError, `[06] Throws TypeError when value of 1st arg. ('key') is an array`)
  t.throws(() => { validateField({}, 4, schema) }, TypeError, `[07] Throws TypeError when value of 1st arg. ('key') is an object`)
  t.throws(() => { validateField(() => {}, 4, schema) }, TypeError, `[08] Throws TypeError when value of 1st arg. ('key') is a function`)
  t.throws(() => { validateField('nonexisting key', 4, schema) }, ValidationError, `[09] Throws ValidationError when value of 1st arg. ('key') doesn't exist in schema`)
  t.throws(() => { validateField('leverantörsId', '7', schema) }, ValidationError, `[10] Throws ValidationError when value of 2nd arg. is a string when expected an integer`)
  t.throws(() => { validateField('valuta', 7, schema) }, ValidationError, `[11] Throws ValidationError when value of 2nd arg. is a number when expected a string`)
  t.throws(() => { validateField('leverantörsId', null, schema) }, TypeError, `[12] Throws TypeError when given null as second argument`)
  t.throws(() => { validateField('leverantörsId', 10, null) }, TypeError, `[13] Throws TypeError when given null as third argument`)
  t.throws(() => { validateField('leverantörsId') }, ReferenceError, `[14] Throws ReferenceError when called with only one argument`)
  t.throws(() => { validateField('leverantörsId', 111) }, ReferenceError, `[15] Throws ReferenceError when called with only two arguments`)
  t.throws(() => { validateField('belopp', 7, schema) }, ValidationError, `[16] Throws ValidationError when value of 2nd arg. is a number when expected an array of numbers`)
  t.throws(() => { validateField('veckodagar', 7, schema) }, ValidationError, `[17] Throws ValidationError when value of 2nd arg. is a number when expected an array of strings`)
  t.throws(() => { validateField('belopp', ['12', '13'], schema) }, ValidationError, `[18] Throws ValidationError when array in 2nd arg. contains strings when expected numbers`)
  t.throws(() => { validateField('veckodagar', [12, 13], schema) }, ValidationError, `[19] Throws ValidationError when array in 2nd arg. contains numbers when expected strings`)
  t.same(validateField('belopp', [12, 13], schema), true, `[20] Returns true when given an array of numbers (ints only) as 2nd argument when expected by schema in 3rd arg.`)
  t.same(validateField('årsränta', [12.73, 13], schema), true, `[21] Returns true when given an array of numbers (both ints & floats) as 2nd argument when expected array of "double" by schema in 3rd arg.`)
  t.same(validateField('veckodagar', ['12', '13'], schema), true, `[22] Returns true when given an array of numbers as 2nd argument when expected by schema in 3rd arg.`)
  t.same(validateField('statsränta', 1.23, schema), true, `[23] Returns true when given a float number when expected by schema in 3rd arg.`)
  t.same(validateField('statsränta', 12, schema), true, `[24] Returns true when given an integer when expected a double by schema in 3rd arg.`)
  t.throws(() => { validateField('belopp', [1.43, 12], schema) }, ValidationError, `[25] Throws ValidationError when array in 2nd arg. contains a float number when expected an integer`)
  t.throws(() => { validateField('uppl.avg', 1.43, schema) }, ValidationError, `[26] Throws ValidationError when value of 2nd arg. is a float number when expected an integer`)
  t.throws(
    () => validateField([], 4, schema, { debug: 1, log: false }),
    TypeError,
    `[27] validateField([], 4, schema, { debug: 1, log: false }) throws TypeError (and should output error to terminal but no log error)`
  )
  t.throws(
    () => validateField([], 4, schema, { debug: 1, log: true }),
    TypeError,
    `[28] validateField([], 4, schema, { debug: 1, log: true }) throws TypeError (and should output error to terminal and log error)`
  )
  t.throws(
    () => validateField([], 4, schema, { debug: 0, log: true }),
    TypeError,
    `[29] validateField([], 4, schema, { debug: 0, log: true }) throws TypeError (and should log error but not output error to terminal)`
  )

  t.end()
})
// tal med decimaler
