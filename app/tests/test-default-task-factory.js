const { test } = require('tap')
const defaultTaskFactory = require('../task-factory/default-task-factory')

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
  t.throws(() => { defaultTaskFactory() }, TypeError, `[01] Throws TypeError when called without any argument`)

  // [02] *****************************************************************************************
  t.throws(() => { defaultTaskFactory(null) }, TypeError, `[02] Throws TypeError when argument is null`)

  // [03] *****************************************************************************************
  t.throws(() => { defaultTaskFactory([]) }, TypeError, `[03] Throws TypeError when argument is an array`)

  // [04] *****************************************************************************************
  t.throws(() => { defaultTaskFactory(12) }, TypeError, `[04] Throws TypeError when argument is a number`)

  // [05] *****************************************************************************************
  t.throws(() => { defaultTaskFactory('12') }, TypeError, `[05] Throws TypeError when argument is a string`)

  // [06] *****************************************************************************************
  t.throws(() => { defaultTaskFactory(true) }, TypeError, `[06] Throws TypeError when argument is a boolean`)

  // [07] *****************************************************************************************
  t.throws(() => { defaultTaskFactory(() => {}) }, TypeError, `[07] Throws TypeError when argument is a function`)

  // [08] *****************************************************************************************
  t.throws(() => { defaultTaskFactory(Promise.resolve(1)) }, TypeError, `[08] Throws TypeError when argument is a promise`)

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
