const { test } = require('tap')
const ValidationError = require('../errors/validation-error')
const scraperStaticTable = require('../scrapers')['static-table']

const html = `<!DOCTYPE html><html><body>
<table>
  <thead>
    <tr><th>Belopp</th><th>Uppl. avg</th><th>Fakt. avg</th><th>Ränta</th><th>Total</th><th>Eff. ränta</th><th>Nom. ränta</th></tr>
  </thead>
  <tbody>
    <tr><td>200 kr</td><td>10 kr</td><td> 11 kr</td><td>12 kr </td><td>  13 kr</td><td>14%</td><td>15%</td></tr>
    <tr><td><strong> 3 000,00 kr</strong></td><td>16 kr</td><td>17 kr</td><td>18 kr</td><td>19 kr</td><td>20%</td><td>21%</td></tr>
  </tbody>
</table></body></html>`
const htmlChanged = `<!DOCTYPE html><html><body>
<table>
  <thead>
    <tr><th>Låna</th><th>Uppl. avg</th><th>Fakt. avg</th><th>Ränta</th><th>Total</th><th>Eff. ränta</th><th>ränta</th></tr>
  </thead>
  <tbody>
    <tr><td>200 kr</td><td>10 kr</td><td> 11 kr</td><td>12 kr </td><td>  13 kr</td><td>14%</td><td>15%</td></tr>
    <tr><td><strong> 3 000,00 kr</strong></td><td>16 kr</td><td>17 kr</td><td>18 kr</td><td>19 kr</td><td>20%</td><td>21%</td></tr>
  </tbody>
</table></body></html>`

const rp = ({ uri }) => {
  if (uri === 'http://example.com') {
    return html
  }
  if (uri === 'http://changed.com') {
    return htmlChanged
  }
}

const options = {
  hdSelector: 'table > thead > tr > th',
  tdSelector: 'table > tbody > tr',
  targetURL: 'http://example.com',
  schema: {
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
    belopp: 200,
    'uppl.avg': 10,
    'fakt.avg': 11,
    'ränta(kr)': 12,
    'betala-totalt': 13,
    'eff.-ränta(%)': 14,
    'nom.-ränta(%)': 15,
    'löptid(d)': 30,
    leverantörsId: 1
  },
  {
    belopp: 3000,
    'uppl.avg': 16,
    'fakt.avg': 17,
    'ränta(kr)': 18,
    'betala-totalt': 19,
    'eff.-ränta(%)': 20,
    'nom.-ränta(%)': 21,
    'löptid(d)': 30,
    leverantörsId: 1
  }
]
let adjustedOpts
let actual
let describe
test('scraperStaticTable()', async (t) => {
  try {
    describe = `[01] Throws ReferenceError when called without arguments`
    await scraperStaticTable()
  } catch (e) {
    t.type(e, ReferenceError, describe)
  }
  try {
    describe = `[02] Throws TypeError when passed null as only argument`
    await scraperStaticTable(null)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[03] Returns an array populated with identical objects,
properties and values when compared to a given fixture. Stub for request used.`
    actual = await scraperStaticTable(options, { rp /* stub */ })
    t.strictSame(actual, expected, describe)
  } catch (e) {
    t.fail(describe)
  }
  try {
    describe = `[04] Throws ReferenceError when missing property 'targetURL' in option object passed`
    adjustedOpts = { ...options }
    delete adjustedOpts.targetURL
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, ReferenceError, describe)
  }
  try {
    describe = `[05] Throws ReferenceError when missing property 'hdSelector' in option object passed`
    adjustedOpts = { ...options }
    delete adjustedOpts.hdSelector
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, ReferenceError, describe)
  }
  try {
    describe = `[06] Throws ReferenceError when missing property 'tdSelector' in option object passed`
    adjustedOpts = { ...options }
    delete adjustedOpts.tdSelector
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, ReferenceError, describe)
  }
  try {
    describe = `[07] Throws ReferenceError when missing property 'schema' in option object passed`
    adjustedOpts = { ...options }
    delete adjustedOpts.schema
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, ReferenceError, describe)
  }
  try {
    describe = `[08] Throws ReferenceError when missing property 'labelMap' in option object passed`
    adjustedOpts = { ...options }
    delete adjustedOpts.labelMap
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, ReferenceError, describe)
  }
  try {
    describe = `[09] Should be possible to pass an argument that doesn't have a property 'fieldInject' in the object`
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
    actual = await scraperStaticTable(adjustedOpts, { rp /* stub */ })
    t.strictSame(actual, altExpected, describe)
  } catch (e) {
    t.fail(describe)
  }
  try {
    describe = `[10] Throws TypeError when property 'targetURL' is null`
    adjustedOpts = { ...options }
    adjustedOpts.targetURL = null
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[11] Throws TypeError when property 'hdSelector' is null`
    adjustedOpts = { ...options }
    adjustedOpts.hdSelector = null
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[12] Throws TypeError when property 'tdSelector' is null`
    adjustedOpts = { ...options }
    adjustedOpts.tdSelector = null
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[13] Throws TypeError when property 'schema' is null`
    adjustedOpts = { ...options }
    adjustedOpts.schema = null
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[14] Throws TypeError when property 'labelMap' is null`
    adjustedOpts = { ...options }
    adjustedOpts.labelMap = null
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[15] Throws TypeError when property 'fieldInject' is null`
    adjustedOpts = { ...options }
    adjustedOpts.fieldInject = null
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[16] Throws TypeError when property 'targetURL' is an object`
    adjustedOpts = { ...options }
    adjustedOpts.targetURL = {}
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[17] Throws TypeError when property 'hdSelector' is an object`
    adjustedOpts = { ...options }
    adjustedOpts.hdSelector = {}
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[18] Throws TypeError when property 'tdSelector' is an object`
    adjustedOpts = { ...options }
    adjustedOpts.tdSelector = {}
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[19] Throws TypeError when property 'labelMap' is an object`
    adjustedOpts = { ...options }
    adjustedOpts.labelMap = {}
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[20] Throws TypeError when property 'targetURL' is an array`
    adjustedOpts = { ...options }
    adjustedOpts.targetURL = []
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[21] Throws TypeError when property 'hdSelector' is an array`
    adjustedOpts = { ...options }
    adjustedOpts.hdSelector = []
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[22] Throws TypeError when property 'tdSelector' is an array`
    adjustedOpts = { ...options }
    adjustedOpts.tdSelector = []
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[23] Throws TypeError when property 'schema' is an array`
    adjustedOpts = { ...options }
    adjustedOpts.schema = []
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[24] Throws TypeError when property 'fieldInject' is an array`
    adjustedOpts = { ...options }
    adjustedOpts.fieldInject = []
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[25] Throws TypeError when property 'targetURL' is a number`
    adjustedOpts = { ...options }
    adjustedOpts.targetURL = 12
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[26] Throws TypeError when property 'hdSelector' is a number`
    adjustedOpts = { ...options }
    adjustedOpts.hdSelector = 12
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[27] Throws TypeError when property 'tdSelector' is a number`
    adjustedOpts = { ...options }
    adjustedOpts.tdSelector = 12
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[28] Throws TypeError when property 'schema' is a number`
    adjustedOpts = { ...options }
    adjustedOpts.schema = 12
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[29] Throws TypeError when property 'labelMap' is a number`
    adjustedOpts = { ...options }
    adjustedOpts.labelMap = 12
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[30] Throws TypeError when property 'fieldInject' is a number`
    adjustedOpts = { ...options }
    adjustedOpts.fieldInject = 12
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[31] Throws TypeError when property 'schema' is a string`
    adjustedOpts = { ...options }
    adjustedOpts.schema = '12'
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[32] Throws TypeError when property 'labelMap' is a string`
    adjustedOpts = { ...options }
    adjustedOpts.labelMap = '12'
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[33] Throws TypeError when property 'fieldInject' is a string`
    adjustedOpts = { ...options }
    adjustedOpts.fieldInject = '12'
    await scraperStaticTable(adjustedOpts)
  } catch (e) {
    t.type(e, TypeError, describe)
  }
  try {
    describe = `[34] Throws ValidationError when table headers extracted from html string doesn't match
the corresponding label values as given in property 'labelMap' of the argument object`
    adjustedOpts = { ...options }
    adjustedOpts.targetURL = 'http://changed.com'
    await scraperStaticTable(adjustedOpts, { rp /* stub */ })
  } catch (e) {
    t.type(e, ValidationError, describe)
  }
  t.end()
}).catch(test.threw)
