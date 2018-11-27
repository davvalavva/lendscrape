const { test } = require('tap')
const staticTableTaskFactory = require('../task-factory/staticTable-task-factory')

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
  trSelector: 'tbody > tr',
  labelMap: [
    { label: 'Belopp', field: 'amount' },
    { label: 'Uppl. avg', field: 'contractingCost' }
  ],
  fieldInject: undefined
}

test('staticTableTaskFactory(creditor)', (t) => {
  t.throws(() => { staticTableTaskFactory() }, TypeError, `[01] Throws TypeError when called without any argument`)

  t.throws(() => { staticTableTaskFactory(null) }, TypeError, `[02] Throws TypeError when argument is null`)

  t.throws(() => { staticTableTaskFactory([]) }, TypeError, `[03] Throws TypeError when argument is an array`)

  t.throws(() => { staticTableTaskFactory(12) }, TypeError, `[04] Throws TypeError when argument is a number`)

  t.throws(() => { staticTableTaskFactory('12') }, TypeError, `[05] Throws TypeError when argument is a string`)

  t.throws(() => { staticTableTaskFactory(true) }, TypeError, `[06] Throws TypeError when argument is a boolean`)

  t.throws(() => { staticTableTaskFactory(() => {}) }, TypeError, `[07] Throws TypeError when argument is a function`)

  t.throws(() => { staticTableTaskFactory(Promise.resolve(1)) }, TypeError, `[08] Throws TypeError when argument is a promise`)

  t.type(staticTableTaskFactory(creditor), 'object', `[09] Returns a value of type Object`)

  const task = staticTableTaskFactory(creditor)
  t.type(task.request, 'function', `[10] Property 'request' of return object is a function`)

  t.type(task.scraper, 'function', `[11] Property 'scraper' of return object is a function`)

  t.type(task.execute, 'function', `[12] Property 'execute' of return object is a function`)

  delete task.request
  delete task.scraper
  delete task.execute
  t.strictSame(task, expected, `[13] Returns object with properties and values as expected`)

  t.end()
})
