const { test } = require('tap')
const VError = require('verror')
const type = require('type-name')
const validationErrors = require('../lib/validation-errors')

const uri1 = '/schemas/task-config/defs.json#/definitions/name'

test('validationErrors({ $id, subject })', (t) => {
  // [01] *****************************************************************************************
  t.throws(() => { validationErrors() }, VError, `[01] Throws VError when given no argument`)

  // [02] *****************************************************************************************
  t.throws(() => { validationErrors({ $id: '/non-existent/schema.json', subject: {} }) }, VError, `[02] Throws VError when given invalid schema uri in '$id' property`)

  // [03] *****************************************************************************************
  t.strictSame(validationErrors({ $id: uri1, subject: 'abc' }), null, `[03] Returns null when validation success`)

  // [04] *****************************************************************************************
  const describe = `[04] Returns object with properties 'schema_$id' (a string) and 'errors' (an array) when validation fails`

  const result = validationErrors({ $id: uri1, subject: 'a' })
  if (type(result) === 'Object' && type(result.schema_$id) === 'string' && type(result.errors) === 'Array') {
    t.pass(describe)
  } else {
    t.fail(describe)
  }

  t.end()
})
