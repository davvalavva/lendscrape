const { test } = require('tap')
const ValidationError = require('../errors/validation-error')
const createTasks = require('../main/create-tasks')

const creditors = [{
  name: 'Creditor1',
  parse: true,
  payload: 'html',
  scraper: { name: 'tests-scraper', async: true },
  targetURL: 'http://localhost:1111',
  fieldInject: { leverantörsId: 1 },
  schema: 'payday-complex-2',
  labelMap: [{ label: 'Belopp', field: 'belopp' }, { label: 'Total', field: 'betala-totalt' }]
}]

const tryAgain = [{
  attemptNo: 1,
  maxRetries: 3,
  creditor: 'Creditor2',
  scraper: () => {},
  isAsyncScraper: true,
  scraperName: 'tests-scraper',
  payload: 'html',
  targetURL: 'http://localhost:1111',
  schema: 'payday-complex-2',
  labelMap: [{ label: 'Belopp', field: 'belopp' }, { label: 'Total', field: 'betala-totalt' }]
}]

const expected = [{
  attemptNo: 1,
  maxRetries: 3,
  creditor: 'Creditor2',
  scraper: () => {},
  isAsyncScraper: true,
  scraperName: 'tests-scraper',
  payload: 'html',
  targetURL: 'http://localhost:1111',
  schema: 'payday-complex-2',
  labelMap: [{ label: 'Belopp', field: 'belopp' }, { label: 'Total', field: 'betala-totalt' }]
}]

let creditorsDirty

test('createTasks()', (t) => {
  t.throws(() => { createTasks() }, ReferenceError, `[01] Throws ReferenceError when called without any arguments`)
  t.throws(() => { createTasks(null) }, TypeError, `[02] Throws TypeError when passed null as only argument to function`)
  t.throws(() => { createTasks({}) }, TypeError, `[03] Throws TypeError when passed an object as only argument to function`)
  t.throws(() => { createTasks(() => {}) }, TypeError, `[04] Throws TypeError when passed a function as only argument to function`)
  t.throws(() => { createTasks(12) }, TypeError, `[05] Throws TypeError when passed a number as only argument to function`)
  t.throws(() => { createTasks('12') }, TypeError, `[06] Throws TypeError when passed a string as only argument to function`)
  t.throws(() => { createTasks(true) }, TypeError, `[07] Throws TypeError when passed a boolean as only argument to function`)
  t.throws(() => { createTasks([]) }, ValidationError, `[08] Throws ValidationError when passed an empty array as only argument to function`)
  creditorsDirty = [...creditors, null]
  t.throws(() => { createTasks(creditorsDirty) }, ValidationError, `[09] Throws ValidationError when found null value inside array passed to function`)
  creditorsDirty = [...creditors, []]
  t.throws(() => { createTasks(creditorsDirty) }, ValidationError, `[10] Throws ValidationError when found array value inside array passed to function`)
  t.strictSame(createTasks(creditors), expected, `[11] Returns an array with one object (task) when passed an array with one object (creditor) to function`)
  creditorsDirty = [...creditors]
  delete creditorsDirty[0].name
  t.throws(() => { createTasks(creditorsDirty) }, ValidationError, `[12] Throws ValidationError when object in array passed to function don't have a 'name' property`)
  creditorsDirty = [...creditors]
  delete creditorsDirty[0].parse
  t.throws(() => { createTasks(creditorsDirty) }, ValidationError, `[13] Throws ValidationError when object in array passed to function don't have a 'parse' property`)
  creditorsDirty = [...creditors]
  delete creditorsDirty[0].payload
  t.throws(() => { createTasks(creditorsDirty) }, ValidationError, `[14] Throws ValidationError when object in array passed to function don't have a 'payload' property`)
  creditorsDirty = [...creditors]
  delete creditorsDirty[0].scraper
  t.throws(() => { createTasks(creditorsDirty) }, ValidationError, `[15] Throws ValidationError when object in array passed to function don't have a 'scraper' property`)
  creditorsDirty = [...creditors]
  delete creditorsDirty[0].targetURL
  t.throws(() => { createTasks(creditorsDirty) }, ValidationError, `[16] Throws ValidationError when object in array passed to function don't have a 'targetURL' property`)
  creditorsDirty = [...creditors]
  delete creditorsDirty[0].schema
  t.throws(() => { createTasks(creditorsDirty) }, ValidationError, `[17] Throws ValidationError when object in array passed to function don't have a 'schema' property`)
  creditorsDirty = [...creditors]
  delete creditorsDirty[0].labelMap
  t.throws(() => { createTasks(creditorsDirty) }, ValidationError, `[18] Throws ValidationError when object in array passed to function don't have a 'labelMap' property`)

  t.end()
})
