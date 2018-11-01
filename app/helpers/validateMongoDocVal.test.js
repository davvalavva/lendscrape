const { test } = require('tap')
const validateVal = require('./validateMongoDocVal')
const { ValidationError } = require('./customErrors')
const schemas = require('../config/schemas.json')

const type = 'type-1'
const schema = schemas[type]

test('validateVal(key, value, schema)', (t) => {
  t.type(validateVal('leverantörsId', 1, schema), 'boolean', `Returns a boolean when given valid arguments`)
  t.same(validateVal('leverantörsId', 1, schema), true, `Returns true when given valid arguments alongside first argument "leverantörsId"`)
  t.same(validateVal('uppl.avg', 50, schema), true, `Returns true when given valid arguments alongside first argument "uppl.avg"`)
  t.same(validateVal('senaste kontroll', '2018-01-13 12:38:11 UTC+1', schema), true, `Returns true when given valid arguments alongside first argument "senaste kontroll"`)
  t.throws(() => { validateVal('nonexisting key', 1, schema) }, ValidationError, `Throws ValidationError when given key in first argument doesn't exist for given schema in 3rd argument`)
  t.throws(() => { validateVal('', '2018-01-13 12:38:11 UTC+1', schema) }, ValidationError, `Throws ValidationError when first argument is an empty string`)
  t.throws(() => { validateVal('	 ', '2018-01-13 12:38:11 UTC+1', schema) }, ValidationError, `Throws ValidationError when first argument consists only of white space`) // eslint-disable-line
  t.throws(() => { validateVal('senaste kontroll', '2018-01-13 12:38:11', schema) }, ValidationError, `Throws ValidationError when wrong format given for value in second argument`)
  t.throws(() => { validateVal('senaste kontroll', 12, schema) }, TypeError, `Throws TypeError when second value is of wrong type for given key in first argument`)
  t.throws(() => { validateVal(44, '2018-01-13 12:38:11 UTC+1', schema) }, TypeError, `Throws TypeError when first argument is a number instead of a string`)
  t.throws(() => { validateVal() }, ReferenceError, `Throws ReferenceError when called without arguments`)
  t.throws(() => { validateVal(null) }, ReferenceError, `Throws ReferenceError when called with null as only argument`)
  t.throws(() => { validateVal('senaste kontroll', null, schema) }, ReferenceError, `Throws ReferenceError when given null as second argument`)
  t.throws(() => { validateVal('senaste kontroll', '2018-01-13 12:38:11 UTC+1', null) }, ReferenceError, `Throws ReferenceError when given null as third argument`)
  t.throws(() => { validateVal('senaste kontroll') }, ReferenceError, `Throws ReferenceError when called with only one argument`)
  t.throws(() => { validateVal('senaste kontroll', '2018-01-13 12:38:11') }, ReferenceError, `Throws ReferenceError when called with only two arguments`)
  t.end()
})
