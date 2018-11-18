const { test } = require('tap')
const taskFactory = require('../main/task-factory')
const ValidationError = require('../errors/validation-error')
const schemas = require('../schemas')
const scrapers = require('../scrapers')
const { SCRAPER_STATIC_TABLE, SCHEMA_PAYDAY_SIMPLE_1 } = require('../main/constants.js')

const creditors = [{
  name: 'kredit365',
  parse: true,
  payload: 'html',
  scraper: {
    name: 'static-table',
    async: true,
    hdSelector: 'table > thead > tr > th',
    tdSelector: 'table > tbody > tr'
  },
  targetURL: 'http://localhost:3000',
  fieldInject: { 'löptid(d)': 30, leverantörsId: 1 },
  schema: 'payday-simple-1',
  labelMap: [{ label: 'Belopp', field: 'belopp' }]
}]
const creditorsInvalid = [{
  name: 'kredit365',
  payload: 'html',
  scraper: {
    name: 'static-table',
    async: true,
    hdSelector: 'table > thead > tr > th',
    tdSelector: 'table > tbody > tr'
  },
  targetURL: 'http://localhost:3000',
  fieldInject: { 'löptid(d)': 30, leverantörsId: 1 },
  schema: 'payday-simple-1',
  labelMap: [{ label: 'Belopp', field: 'belopp' }]
}]

const tasks = [{
  attemptNo: 1,
  maxAttempts: null,
  creditor: 'kredit365',
  scraper: scrapers[SCRAPER_STATIC_TABLE],
  isAsyncScraper: true,
  scraperName: 'static-table',
  payload: 'html',
  targetURL: 'http://localhost:3000',
  schema: schemas[SCHEMA_PAYDAY_SIMPLE_1],
  hdSelector: 'table > thead > tr > th',
  tdSelector: 'table > tbody > tr',
  labelMap: [{ label: 'Belopp', field: 'belopp' }],
  fieldInject: { 'löptid(d)': 30, leverantörsId: 1 }
}]

test('taskFactory(creditors)', (t) => {
  t.throws(() => { taskFactory() }, ReferenceError, `[01] Throws ReferenceError when no argument given`)
  t.throws(() => { taskFactory(null) }, TypeError, `[02] Throws TypeError when given null as argument`)
  t.throws(() => { taskFactory({}) }, TypeError, `[03] Throws TypeError when given an object as argument`)
  t.throws(() => { taskFactory(() => {}) }, TypeError, `[04] Throws TypeError when given a function as argument`)
  t.throws(() => { taskFactory(Promise.resolve(1)) }, TypeError, `[05] Throws TypeError when given a promise as argument`)
  t.throws(() => { taskFactory(true) }, TypeError, `[06] Throws TypeError when given a boolean as argument`)
  t.throws(() => { taskFactory(12) }, TypeError, `[07] Throws TypeError when given a number as argument`)
  t.throws(() => { taskFactory('12') }, TypeError, `[08] Throws TypeError when given a string as argument`)
  t.strictSame(taskFactory([]), [], `[09] Returns an empty array when given an empty array as argument`)
  t.throws(() => { taskFactory(creditorsInvalid) }, ValidationError, `[10] Throws ValidationError when given an array with invalid data as argument`)
  t.strictSame(taskFactory(creditors), tasks, `[11] Returns an array with one task object identical to an expected object`)

  t.end()
})
