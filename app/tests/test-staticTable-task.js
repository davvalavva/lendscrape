const { test } = require('tap')
const staticTableTaskFactory = require('../task-factory/staticTable-task')
const ValidationError = require('../errors/validation-error')

const creditor = {
  name: 'somename',
  task: 'staticTable',
  targetURL: 'http://localhost:9999',
  documentSchemaId: '/schemas/documents/paydayVariant1.json#',
  hdSelector: 'thead > tr > td',
  trSelector: 'tbody > tr',
  labelMap: [
    { label: 'Belopp', field: 'amount' },
    { label: 'Uppl. avg', field: 'contractingCost' }
  ]
}
const expected = {
  attemptNo: 1,
  maxAttempts: undefined,
  creditor: 'somename',
  targetURL: 'http://localhost:9999',
  documentSchemaId: '/schemas/documents/paydayVariant1.json#',
  hdSelector: 'thead > tr > td',
  trSelector: 'tbody > tr'
}

test('staticTableTaskFactory(creditor)', (t) => {
  // [01] *****************************************************************************************
  t.throws(() => { staticTableTaskFactory() }, TypeError, `[01] Throws TypeError when given no any argument`)

  // [02] *****************************************************************************************
  t.throws(() => { staticTableTaskFactory(null) }, TypeError, `[02] Throws TypeError when given null`)

  // [03] *****************************************************************************************
  t.throws(() => { staticTableTaskFactory([]) }, TypeError, `[03] Throws TypeError when given an array`)

  // [04] *****************************************************************************************
  t.throws(() => { staticTableTaskFactory(12) }, TypeError, `[04] Throws TypeError when given a number`)

  // [05] *****************************************************************************************
  t.throws(() => { staticTableTaskFactory('12') }, TypeError, `[05] Throws TypeError when given a string`)

  // [06] *****************************************************************************************
  t.throws(() => { staticTableTaskFactory(true) }, TypeError, `[06] Throws TypeError when given a boolean`)

  // [07] *****************************************************************************************
  t.throws(() => { staticTableTaskFactory(() => {}) }, TypeError, `[07] Throws TypeError when given a function`)

  // [08] *****************************************************************************************
  t.throws(() => { staticTableTaskFactory(Promise.resolve(1)) }, TypeError, `[08] Throws TypeError when given a promise`)

  // [09] *****************************************************************************************
  t.type(staticTableTaskFactory(creditor), 'object', `[09] Returns an object`)

  // [10] *****************************************************************************************
  const task = staticTableTaskFactory(creditor)
  t.type(task.request, 'function', `[10] Returns an object where property 'request' is a function`)

  // [11] *****************************************************************************************
  t.type(task.execute, 'function', `[11] Property 'execute' of return object is a function`)

  // [12] *****************************************************************************************
  delete task.request
  delete task.execute
  t.strictSame(task, expected, `[12] Returns object with properties and values as expected`)

  // [13] *****************************************************************************************
  let invalidCreditor = { ...creditor }
  delete invalidCreditor.name
  t.throws(() => { staticTableTaskFactory(invalidCreditor) }, ValidationError, `[13] Throws ValidationError when passed invalid creditor object`)

  // [14] *****************************************************************************************
  invalidCreditor = { ...creditor }
  delete invalidCreditor.task
  t.throws(() => { staticTableTaskFactory(invalidCreditor) }, ValidationError, `[14] Throws ValidationError when passed invalid creditor object`)

  // [15] *****************************************************************************************
  invalidCreditor = { ...creditor }
  delete invalidCreditor.targetURL
  t.throws(() => { staticTableTaskFactory(invalidCreditor) }, ValidationError, `[15] Throws ValidationError when passed invalid creditor object`)

  // [16] *****************************************************************************************
  invalidCreditor = { ...creditor }
  delete invalidCreditor.documentSchemaId
  t.throws(() => { staticTableTaskFactory(invalidCreditor) }, ValidationError, `[16] Throws ValidationError when passed invalid creditor object`)

  // [17] *****************************************************************************************
  invalidCreditor = { ...creditor }
  delete invalidCreditor.hdSelector
  t.throws(() => { staticTableTaskFactory(invalidCreditor) }, ValidationError, `[17] Throws ValidationError when passed invalid creditor object`)

  // [18] *****************************************************************************************
  invalidCreditor = { ...creditor }
  delete invalidCreditor.trSelector
  t.throws(() => { staticTableTaskFactory(invalidCreditor) }, ValidationError, `[18] Throws ValidationError when passed invalid creditor object`)

  // [19] *****************************************************************************************
  invalidCreditor = { ...creditor }
  delete invalidCreditor.labelMap
  t.throws(() => { staticTableTaskFactory(invalidCreditor) }, ValidationError, `[19] Throws ValidationError when passed invalid creditor object`)

  t.end()
})
