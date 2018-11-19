const { test } = require('tap')
const taskFactory = require('../main/task-factory')
const ValidationError = require('../errors/validation-error')
const scrapers = require('../scrapers')
const { SCRAPER_STATIC_TABLE } = require('../main/constants.js')

const schemas = {
  'payday-simple-1': {
    leverantörsId: { keyType: ['number'], min: 1, isInteger: true },
    belopp: { keyType: ['number'], min: 0, isInteger: true },
    'uppl.avg': { keyType: ['number'], min: 0, isInteger: true },
    'fakt.avg': { keyType: ['number'], min: 0, isInteger: true },
    'ränta(kr)': { keyType: ['number'], min: 0, isInteger: true },
    'betala-totalt': { keyType: ['number'], min: 0, isInteger: true },
    'eff.-ränta(%)': { keyType: ['number'], min: 0, isInteger: true },
    'nom.-ränta(%)': { keyType: ['number'], min: 0, isInteger: true },
    'löptid(d)': { keyType: ['number'], min: 0, isInteger: true }
  },
  creditor: {
    name: { keyType: ['string'] },
    parse: { keyType: ['boolean'] },
    payload: { keyType: ['string'], allowed: ['html'] },
    scraper: {
      name: { keyType: ['string'] },
      async: { keyType: ['boolean'] },
      hdSelector: { keyType: ['string', 'null'], default: null },
      trSelector: { keyType: ['string', 'null'], default: null }
    },
    targetURL: { keyType: ['string'], regExp: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/ }, // eslint-disable-line
    fieldInject: { keyType: ['object', 'null'], default: null },
    schema: { keyType: ['string'], allowed: ['payday-simple-1'] },
    labelMap: { keyType: ['array'] }
  }
}

const creditors = [{
  name: 'kredit365',
  parse: true,
  payload: 'html',
  scraper: {
    name: 'static-table',
    async: true,
    hdSelector: 'table > thead > tr > th',
    trSelector: 'table > tbody > tr'
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
    trSelector: 'table > tbody > tr'
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
  schema: schemas['payday-simple-1'],
  hdSelector: 'table > thead > tr > th',
  trSelector: 'table > tbody > tr',
  labelMap: [{ label: 'Belopp', field: 'belopp' }],
  fieldInject: { 'löptid(d)': 30, leverantörsId: 1 }
}]

test('taskFactory(creditors)', (t) => {
  t.throws(() => { taskFactory() }, ReferenceError, `[01] Throws ReferenceError when no argument given`)
  t.throws(() => { taskFactory(null, schemas) }, TypeError, `[02] Throws TypeError when given null as 1st argument`)
  t.throws(() => { taskFactory({}, schemas) }, TypeError, `[03] Throws TypeError when given an object as 1st argument`)
  t.throws(() => { taskFactory(() => {}, schemas) }, TypeError, `[04] Throws TypeError when given a function as 1st argument`)
  t.throws(() => { taskFactory(Promise.resolve(1), schemas) }, TypeError, `[05] Throws TypeError when given a promise as 1st argument`)
  t.throws(() => { taskFactory(true, schemas) }, TypeError, `[06] Throws TypeError when given a boolean as 1st argument`)
  t.throws(() => { taskFactory(12, schemas) }, TypeError, `[07] Throws TypeError when given a number as 1st argument`)
  t.throws(() => { taskFactory('12', schemas) }, TypeError, `[08] Throws TypeError when given a string as 1st argument`)
  t.strictSame(taskFactory([], schemas), [], `[09] Returns an empty array when given an empty array as 1st argument`)

  t.throws(() => { taskFactory(creditors) }, ReferenceError, `[01] Throws ReferenceError when no 2nd argument is given`)
  t.throws(() => { taskFactory(creditors, null) }, TypeError, `[02] Throws TypeError when given null as 2nd argument`)
  t.throws(() => { taskFactory(creditors, []) }, TypeError, `[03] Throws TypeError when given an array as 2nd argument`)
  t.throws(() => { taskFactory(creditors, () => {}) }, TypeError, `[04] Throws TypeError when given a function as 2nd argument`)
  t.throws(() => { taskFactory(creditors, Promise.resolve(1)) }, TypeError, `[05] Throws TypeError when given a promise as 2nd argument`)
  t.throws(() => { taskFactory(creditors, true) }, TypeError, `[06] Throws TypeError when given a boolean as 2nd argument`)
  t.throws(() => { taskFactory(creditors, 12) }, TypeError, `[07] Throws TypeError when given a number as 2nd argument`)
  t.throws(() => { taskFactory(creditors, '12') }, TypeError, `[08] Throws TypeError when given a string as 2nd argument`)
  t.throws(() => { taskFactory(creditors, {}) }, ValidationError, `[08] Throws ValidationError when given an empty object as 2nd argument`)

  t.throws(() => { taskFactory(creditorsInvalid, schemas) }, ValidationError, `[10] Throws ValidationError when given an array with invalid data as 1st argument`)
  t.strictSame(taskFactory(creditors, schemas), tasks, `[11] Returns an array with one task object identical to an expected object`)

  t.end()
})
