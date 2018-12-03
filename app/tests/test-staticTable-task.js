const { test } = require('tap')
const VError = require('verror')
const staticTableTaskFactory = require('../task-factory/staticTable-task')

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
  t.throws(() => { staticTableTaskFactory() }, VError, `[01] Throws VError when given no any argument`)

  // [02] *****************************************************************************************
  t.throws(() => { staticTableTaskFactory(null) }, VError, `[02] Throws VError when given null`)

  // [03] *****************************************************************************************
  t.throws(() => { staticTableTaskFactory([]) }, VError, `[03] Throws VError when given an array`)

  // [04] *****************************************************************************************
  t.throws(() => { staticTableTaskFactory(12) }, VError, `[04] Throws VError when given a number`)

  // [05] *****************************************************************************************
  t.throws(() => { staticTableTaskFactory('12') }, VError, `[05] Throws VError when given a string`)

  // [06] *****************************************************************************************
  t.throws(() => { staticTableTaskFactory(true) }, VError, `[06] Throws VError when given a boolean`)

  // [07] *****************************************************************************************
  t.throws(() => { staticTableTaskFactory(() => {}) }, VError, `[07] Throws VError when given a function`)

  // [08] *****************************************************************************************
  t.throws(() => { staticTableTaskFactory(Promise.resolve(1)) }, VError, `[08] Throws VError when given a promise`)

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
  t.throws(() => { staticTableTaskFactory(invalidCreditor) }, VError, `[13] Throws VError when passed invalid creditor object`)

  // [14] *****************************************************************************************
  invalidCreditor = { ...creditor }
  delete invalidCreditor.task
  t.throws(() => { staticTableTaskFactory(invalidCreditor) }, VError, `[14] Throws VError when passed invalid creditor object`)

  // [15] *****************************************************************************************
  invalidCreditor = { ...creditor }
  delete invalidCreditor.targetURL
  t.throws(() => { staticTableTaskFactory(invalidCreditor) }, VError, `[15] Throws VError when passed invalid creditor object`)

  // [16] *****************************************************************************************
  invalidCreditor = { ...creditor }
  delete invalidCreditor.documentSchemaId
  t.throws(() => { staticTableTaskFactory(invalidCreditor) }, VError, `[16] Throws VError when passed invalid creditor object`)

  // [17] *****************************************************************************************
  invalidCreditor = { ...creditor }
  delete invalidCreditor.hdSelector
  t.throws(() => { staticTableTaskFactory(invalidCreditor) }, VError, `[17] Throws VError when passed invalid creditor object`)

  // [18] *****************************************************************************************
  invalidCreditor = { ...creditor }
  delete invalidCreditor.trSelector
  t.throws(() => { staticTableTaskFactory(invalidCreditor) }, VError, `[18] Throws VError when passed invalid creditor object`)

  // [19] *****************************************************************************************
  invalidCreditor = { ...creditor }
  delete invalidCreditor.labelMap
  t.throws(() => { staticTableTaskFactory(invalidCreditor) }, VError, `[19] Throws VError when passed invalid creditor object`)

  t.end()
})
