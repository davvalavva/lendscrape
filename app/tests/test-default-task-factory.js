const { test } = require('tap')
const requestPromiseNative = require('request-promise-native')
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
  request: requestPromiseNative,
  targetURL: 'http://localhost:9999',
  documentSchemaId: '/schemas/documents/paydayVariant1.json#'
}

test('defaultTaskFactory(creditor)', (t) => {
  t.throws(() => { defaultTaskFactory() }, TypeError, `[01] Throws TypeError when called without any argument`)

  t.throws(() => { defaultTaskFactory(null) }, TypeError, `[02] Throws TypeError when argument is null`)

  t.throws(() => { defaultTaskFactory([]) }, TypeError, `[03] Throws TypeError when argument is an array`)

  t.throws(() => { defaultTaskFactory(12) }, TypeError, `[04] Throws TypeError when argument is a number`)

  t.throws(() => { defaultTaskFactory('12') }, TypeError, `[05] Throws TypeError when argument is a string`)

  t.throws(() => { defaultTaskFactory(true) }, TypeError, `[06] Throws TypeError when argument is a boolean`)

  t.throws(() => { defaultTaskFactory(() => {}) }, TypeError, `[07] Throws TypeError when argument is a function`)

  t.throws(() => { defaultTaskFactory(Promise.resolve(1)) }, TypeError, `[08] Throws TypeError when argument is a promise`)

  t.type(defaultTaskFactory(creditor), 'object', `[09] Returns a value of type Object`)

  t.strictSame(defaultTaskFactory(creditor), expected, `[10] Returns object with properties and values as expected`)

  t.end()
})
