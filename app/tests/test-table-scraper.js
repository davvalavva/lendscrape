const fs = require('fs')
const { test } = require('tap')
const ValidationError = require('../errors/validation-error')
const tableScraper = require('../lib/table-scraper')

const html = fs.readFileSync('./app/tests/fixtures/testpage-table-scraper.html').toString()
const htmlHeadersChanged = fs.readFileSync('./app/tests/fixtures/testpage-table-scraper-changed-headers.html').toString()

const options = {
  html,
  hdSelector: 'table > thead > tr > th',
  tdSelector: 'table > tbody > tr',
  schema: {
    leverantörsId: { required: true, BSON: 'int' },
    belopp: { required: true, BSON: 'int' },
    'uppl.avg': { required: false, BSON: 'int' },
    'fakt.avg': { required: false, BSON: 'int' },
    'ränta(kr)': { required: false, BSON: 'int' },
    'betala-totalt': { required: false, BSON: 'int' },
    'eff.-ränta(%)': { required: false, BSON: 'int' },
    'nom.-ränta(%)': { required: false, BSON: 'int' },
    'löptid(d)': { required: true, BSON: 'int' }
  },
  labelMap: [
    { label: 'Belopp', field: 'belopp' },
    { label: 'Uppl. avg', field: 'uppl.avg' },
    { label: 'Fakt. avg', field: 'fakt.avg' },
    { label: 'Ränta', field: 'ränta(kr)' },
    { label: 'Total', field: 'betala-totalt' },
    { label: 'Eff. ränta', field: 'eff.-ränta(%)' },
    { label: 'Nom. ränta', field: 'nom.-ränta(%)' }],
  fieldInject: {
    'löptid(d)': 30,
    leverantörsId: 1
  }
}
// expected when scraped from ./fixtures/testpage.html
const expected = [
  {
    belopp: 100,
    'uppl.avg': 13,
    'fakt.avg': 14,
    'ränta(kr)': 16,
    'betala-totalt': 12,
    'eff.-ränta(%)': 111,
    'nom.-ränta(%)': 39,
    'löptid(d)': 30,
    leverantörsId: 1
  },
  {
    belopp: 200,
    'uppl.avg': 21,
    'fakt.avg': 24,
    'ränta(kr)': 31,
    'betala-totalt': 13,
    'eff.-ränta(%)': 153,
    'nom.-ränta(%)': 49,
    'löptid(d)': 30,
    leverantörsId: 1
  }
]
let adjustedOpts

test('tableScraper(options)', (t) => {
  t.throws(() => tableScraper(), ReferenceError, `[01] Throws ReferenceError when called without any arguments`)
  t.throws(() => tableScraper(null), TypeError, `[02] Throws TypeError when passed null as only argument`)
  t.same(tableScraper(options), expected, `[03] returns expected array of objects (documents) when success`)
  adjustedOpts = { ...options }
  delete adjustedOpts.html
  t.throws(() => tableScraper(adjustedOpts), ReferenceError, `[04] Throws ReferenceError when missing property 'html' in option object passed`)
  adjustedOpts = { ...options }
  delete adjustedOpts.hdSelector
  t.throws(() => tableScraper(adjustedOpts), ReferenceError, `[05] Throws ReferenceError when missing property 'hdSelector' in option object passed`)
  adjustedOpts = { ...options }
  delete adjustedOpts.tdSelector
  t.throws(() => tableScraper(adjustedOpts), ReferenceError, `[06] Throws ReferenceError when missing property 'tdSelector' in option object passed`)
  adjustedOpts = { ...options }
  delete adjustedOpts.schema
  t.throws(() => tableScraper(adjustedOpts), ReferenceError, `[07] Throws ReferenceError when missing property 'schema' in option object passed`)
  adjustedOpts = { ...options }
  delete adjustedOpts.labelMap
  t.throws(() => tableScraper(adjustedOpts), ReferenceError, `[08] Throws ReferenceError when missing property 'labelMap' in option object passed`)
  adjustedOpts = { ...options }
  delete adjustedOpts.fieldInject
  const altSchema = { ...options.schema }
  delete altSchema.leverantörsId
  delete altSchema['löptid(d)']
  adjustedOpts.schema = altSchema
  const altExpected = [...expected]
  delete altExpected[0]['löptid(d)']
  delete altExpected[1]['löptid(d)']
  delete altExpected[0].leverantörsId
  delete altExpected[1].leverantörsId
  t.same(tableScraper(adjustedOpts), altExpected, `[09] success without property 'fieldInject' given in option object passed (schema changed to work)`)

  // Properties with value null >>> incorrect type
  adjustedOpts = { ...options }
  adjustedOpts.html = null
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[10] Throws TypeError when property 'html' is null`)
  adjustedOpts = { ...options }
  adjustedOpts.hdSelector = null
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[11] Throws TypeError when property 'hdSelector' is null`)
  adjustedOpts = { ...options }
  adjustedOpts.tdSelector = null
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[12] Throws TypeError when property 'tdSelector' is null`)
  adjustedOpts = { ...options }
  adjustedOpts.schema = null
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[13] Throws TypeError when property 'schema' is null`)
  adjustedOpts = { ...options }
  adjustedOpts.labelMap = null
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[14] Throws TypeError when property 'labelMap' is null`)
  adjustedOpts = { ...options }
  adjustedOpts.fieldInject = null
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[15] Throws TypeError when property 'fieldInject' is null`)

  // Properties with object value >>> incorrect type
  adjustedOpts = { ...options }
  adjustedOpts.html = {}
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[16] Throws TypeError when property 'html' is an object`)
  adjustedOpts = { ...options }
  adjustedOpts.hdSelector = {}
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[17] Throws TypeError when property 'hdSelector' is an object`)
  adjustedOpts = { ...options }
  adjustedOpts.tdSelector = {}
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[18] Throws TypeError when property 'tdSelector' is an object`)
  adjustedOpts = { ...options }
  adjustedOpts.labelMap = {}
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[19] Throws TypeError when property 'labelMap' is an object`)

  // Properties with array value >>> incorrect type
  adjustedOpts = { ...options }
  adjustedOpts.html = []
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[20] Throws TypeError when property 'html' is an array`)
  adjustedOpts = { ...options }
  adjustedOpts.hdSelector = []
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[21] Throws TypeError when property 'hdSelector' is an array`)
  adjustedOpts = { ...options }
  adjustedOpts.tdSelector = []
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[22] Throws TypeError when property 'tdSelector' is an array`)
  adjustedOpts = { ...options }
  adjustedOpts.schema = []
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[23] Throws TypeError when property 'schema' is an array`)
  adjustedOpts = { ...options }
  adjustedOpts.fieldInject = []
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[24] Throws TypeError when property 'fieldInject' is an array`)

  // Properties with number value >>> incorrect type
  adjustedOpts = { ...options }
  adjustedOpts.html = 12
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[25] Throws TypeError when property 'html' is a number`)
  adjustedOpts = { ...options }
  adjustedOpts.hdSelector = 12
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[26] Throws TypeError when property 'hdSelector' is a number`)
  adjustedOpts = { ...options }
  adjustedOpts.tdSelector = 12
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[27] Throws TypeError when property 'tdSelector' is a number`)
  adjustedOpts = { ...options }
  adjustedOpts.schema = 12
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[28] Throws TypeError when property 'schema' is a number`)
  adjustedOpts = { ...options }
  adjustedOpts.labelMap = 12
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[29] Throws TypeError when property 'labelMap' is a number`)
  adjustedOpts = { ...options }
  adjustedOpts.fieldInject = 12
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[30] Throws TypeError when property 'fieldInject' is a number`)

  // Properties with string value >>> incorrect type
  adjustedOpts = { ...options }
  adjustedOpts.schema = '12'
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[31] Throws TypeError when property 'schema' is a string`)
  adjustedOpts = { ...options }
  adjustedOpts.labelMap = '12'
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[32] Throws TypeError when property 'labelMap' is a string`)
  adjustedOpts = { ...options }
  adjustedOpts.fieldInject = '12'
  t.throws(() => tableScraper(adjustedOpts), TypeError, `[33] Throws TypeError when property 'fieldInject' is a string`)

  adjustedOpts = { ...options }
  adjustedOpts.html = htmlHeadersChanged
  t.throws(() => tableScraper(adjustedOpts), ValidationError, `[34] Throws ValidationError when table headers changed in the html`)

  t.throws(() => tableScraper(null, { debug: 1, log: false }), TypeError, `[35] tableScraper(null, { debug: 1, log: false }) throws TypeError (and should output error to terminal but no log error)`)
  t.throws(() => tableScraper(null, { debug: 1, log: true }), TypeError, `[36] tableScraper(null, { debug: 1, log: true }) throws TypeError (and should output error to terminal and log error)`)
  t.throws(() => tableScraper(null, { debug: 0, log: true }), TypeError, `[37] tableScraper(null, { debug: 0, log: true }) throws TypeError (and should log error but not output error to terminal)`)
  t.end()
})
