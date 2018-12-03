const { test } = require('tap')
const taskFactory = require('../task-factory')
const type = require('type-name')
const ValidationError = require('../errors/validation-error')

const creditors = [{
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
}]
const expected = [{
  attemptNo: 1,
  maxAttempts: undefined,
  creditor: 'somename',
  targetURL: 'http://localhost:9999',
  documentSchemaId: '/schemas/documents/paydayVariant1.json#',
  hdSelector: 'thead > tr > td',
  trSelector: 'tbody > tr'
}]

test('taskFactory(creditors)', (t) => {
  // [01] *****************************************************************************************
  t.throws(() => { taskFactory() }, TypeError, `[01] Throws TypeError when called without any argument`)

  // [02] *****************************************************************************************
  t.throws(() => { taskFactory(null) }, TypeError, `[02] Throws TypeError when argument is null`)

  // [03] *****************************************************************************************
  t.throws(() => { taskFactory({}) }, TypeError, `[03] Throws TypeError when argument is an object`)

  // [04] *****************************************************************************************
  t.throws(() => { taskFactory(12) }, TypeError, `[04] Throws TypeError when argument is a number`)

  // [05] *****************************************************************************************
  t.throws(() => { taskFactory('12') }, TypeError, `[05] Throws TypeError when argument is a string`)

  // [06] *****************************************************************************************
  t.throws(() => { taskFactory(true) }, TypeError, `[06] Throws TypeError when argument is a boolean`)

  // [07] *****************************************************************************************
  t.throws(() => { taskFactory(Promise.resolve(1)) }, TypeError, `[07] Throws TypeError when argument is a promise`)

  // [08] *****************************************************************************************
  t.strictSame(type(taskFactory(creditors)), 'Array', `[08] Returns an array`)

  // [09] *****************************************************************************************
  const task = taskFactory(creditors)[0]
  t.type(task.request, 'function', `[09] Property 'request' of first object in the array returned is a function`)

  // [10] *****************************************************************************************
  t.type(task.execute, 'function', `[10] Property 'execute' of first object in the array returned is a function`)

  // [11] *****************************************************************************************
  delete task.request
  delete task.scraper
  delete task.execute
  t.strictSame([task], expected, `[11] Returns an array with one object having properties and values as expected`)

  // [12] *****************************************************************************************
  let invalidcreditors = [{ ...creditors[0] }]
  delete invalidcreditors[0].name
  t.throws(() => { taskFactory(invalidcreditors) }, ValidationError, `[12] Throws ValidationError when passed invalid creditors object`)

  // [13] *****************************************************************************************
  invalidcreditors = [{ ...creditors[0] }]
  delete invalidcreditors[0].task
  t.throws(() => { taskFactory(invalidcreditors) }, ValidationError, `[13] Throws ValidationError when passed invalid creditors object`)

  // [14] *****************************************************************************************
  invalidcreditors = [{ ...creditors[0] }]
  delete invalidcreditors[0].targetURL
  t.throws(() => { taskFactory(invalidcreditors) }, ValidationError, `[14] Throws ValidationError when passed invalid creditors object`)

  // [15] *****************************************************************************************
  invalidcreditors = [{ ...creditors[0] }]
  delete invalidcreditors[0].documentSchemaId
  t.throws(() => { taskFactory(invalidcreditors) }, ValidationError, `[15] Throws ValidationError when passed invalid creditors object`)

  // [16] *****************************************************************************************
  invalidcreditors = [{ ...creditors[0] }]
  delete invalidcreditors[0].hdSelector
  t.throws(() => { taskFactory(invalidcreditors) }, ValidationError, `[16] Throws ValidationError when passed invalid creditors object`)

  // [17] *****************************************************************************************
  invalidcreditors = [{ ...creditors[0] }]
  delete invalidcreditors[0].trSelector
  t.throws(() => { taskFactory(invalidcreditors) }, ValidationError, `[17] Throws ValidationError when passed invalid creditors object`)

  // [18] *****************************************************************************************
  invalidcreditors = [{ ...creditors[0] }]
  delete invalidcreditors[0].labelMap
  t.throws(() => { taskFactory(invalidcreditors) }, ValidationError, `[18] Throws ValidationError when passed invalid creditors object`)

  t.end()
})
