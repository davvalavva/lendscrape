const { test } = require('tap')
const VError = require('verror')
const defaultTaskFactory = require('../task-factory/default-task')

const creditor = {
  name: 'somename',
  task: 'staticTable',
  targetURL: 'http://localhost:9999',
  documentSchemaId: '/schemas/documents/paydayVariant1.json#'
}
const expected = {
  attemptNo: 1,
  maxAttempts: undefined,
  creditor: 'somename',
  targetURL: 'http://localhost:9999',
  documentSchemaId: '/schemas/documents/paydayVariant1.json#'
}

test('defaultTaskFactory(creditor)', (t) => {
  // [01] *****************************************************************************************
  t.throws(() => { defaultTaskFactory() }, VError, `[01] Throws VError when called without any argument`)

  // [02] *****************************************************************************************
  t.throws(() => { defaultTaskFactory(null) }, VError, `[02] Throws VError when argument is null`)

  // [03] *****************************************************************************************
  t.throws(() => { defaultTaskFactory([]) }, VError, `[03] Throws VError when argument is an array`)

  // [04] *****************************************************************************************
  t.throws(() => { defaultTaskFactory(12) }, VError, `[04] Throws VError when argument is a number`)

  // [05] *****************************************************************************************
  t.throws(() => { defaultTaskFactory('12') }, VError, `[05] Throws VError when argument is a string`)

  // [06] *****************************************************************************************
  t.throws(() => { defaultTaskFactory(true) }, VError, `[06] Throws VError when argument is a boolean`)

  // [07] *****************************************************************************************
  t.throws(() => { defaultTaskFactory(() => {}) }, VError, `[07] Throws VError when argument is a function`)

  // [08] *****************************************************************************************
  t.throws(() => { defaultTaskFactory(Promise.resolve(1)) }, VError, `[08] Throws VError when argument is a promise`)

  // [09] *****************************************************************************************
  t.type(defaultTaskFactory(creditor), 'object', `[09] Returns a value of type Object`)

  // [10] *****************************************************************************************
  const task = defaultTaskFactory(creditor)
  t.type(task.request, 'function', `[10] Property 'request' of return object is a function`)

  // [11] *****************************************************************************************
  delete task.request
  t.strictSame(task, expected, `[11] Returns object with properties and values as expected`)

  t.end()
})
