const { test } = require('tap')
const toDocuments = require('../lib/to-documents')

const labelMap = JSON.parse(`
[
  { "key": "Belopp",     "field": "belopp"        },
  { "key": "Uppl. avg",  "field": "uppl.avg"      },
  { "key": "Fakt. avg",  "field": "fakt.avg"      },
  { "key": "Ränta",      "field": "ränta(kr)"     },
  { "key": "Total",      "field": "betala-totalt" },
  { "key": "Eff. ränta", "field": "eff.-ränta(%)" },
  { "key": "Nom. ränta", "field": "nom.-ränta(%)" }
]`)

const rows = JSON.parse(`[
  [2000, 350, 45, 64, 2459, 1135, 39],
  [3000, 350, 45, 96, 3491, 532,  39]
]`)

const expected = JSON.parse(`[
  {
    "belopp":        2000,
    "uppl.avg":      350,
    "fakt.avg":      45,
    "ränta(kr)":     64,
    "betala-totalt": 2459,
    "eff.-ränta(%)": 1135,
    "nom.-ränta(%)": 39
  },
  {
    "belopp":        3000,
    "uppl.avg":      350,
    "fakt.avg":      45,
    "ränta(kr)":     96,
    "betala-totalt": 3491,
    "eff.-ränta(%)": 532,
    "nom.-ränta(%)": 39
  }
]`)

test('toDocuments({ rows, labelMap, fieldInject })', (t) => {
  // [01] *****************************************************************************************
  let data = { rows, labelMap }
  t.type(toDocuments(data), 'object', `[01] Returns a value of type Object`)

  // [02] *****************************************************************************************
  t.strictSame(toDocuments(data), expected, `[02] Returns object with expected key value pairs`)

  // [03] *****************************************************************************************
  const fieldInject = { providerId: 12 }
  data = { rows, labelMap, fieldInject }
  const expected2 = expected.map(doc => ({ ...doc, providerId: 12 }))
  t.strictSame(toDocuments(data), expected2, `[03] Returns object with expected key value pairs`)

  // [04] *****************************************************************************************
  t.throws(() => { toDocuments() }, TypeError, `[04] Throws TypeError when called without any argument`)

  // [05] *****************************************************************************************
  t.throws(() => { toDocuments(null) }, TypeError, `[05] Throws TypeError when argument is null`)

  // [06] *****************************************************************************************
  t.throws(() => { toDocuments([]) }, TypeError, `[06] Throws TypeError when argument is an array`)

  // [07] *****************************************************************************************
  t.throws(() => { toDocuments(() => {}) }, TypeError, `[07] Throws TypeError when argument is an function`)

  // [08] *****************************************************************************************
  t.throws(() => { toDocuments('abc') }, TypeError, `[08] Throws TypeError when argument is a string`)

  // [09] *****************************************************************************************
  t.throws(() => { toDocuments(12) }, TypeError, `[09] Throws TypeError when argument is a number`)

  // [10] *****************************************************************************************
  data = { labelMap }
  t.throws(() => { toDocuments(data) }, TypeError, `[10] Throws TypeError when property 'rows' missing`)

  // [11] *****************************************************************************************
  data = { rows }
  t.throws(() => { toDocuments(data) }, TypeError, `[11] Throws TypeError when property 'labelMap'`)

  // [12] *****************************************************************************************
  data = { rows: null, labelMap }
  t.throws(() => { toDocuments(data) }, TypeError, `[12] Throws TypeError when property 'rows' is null`)

  // [13] *****************************************************************************************
  data = { rows: {}, labelMap }
  t.throws(() => { toDocuments(data) }, TypeError, `[13] Throws TypeError when property 'rows' is an object`)

  // [14] *****************************************************************************************
  data = { rows: 'abc', labelMap }
  t.throws(() => { toDocuments(data) }, TypeError, `[14] Throws TypeError when property 'rows' is a string`)

  // [15] *****************************************************************************************
  data = { rows: 12, labelMap }
  t.throws(() => { toDocuments(data) }, TypeError, `[15] Throws TypeError when property 'rows' is a number`)

  // [16] *****************************************************************************************
  data = { rows: [], labelMap }
  t.throws(() => { toDocuments(data) }, TypeError, `[16] Throws TypeError when property 'rows' is an empty array`)

  // [17] *****************************************************************************************
  data = { rows: [[12], 12], labelMap }
  t.throws(() => { toDocuments(data) }, TypeError, `[17] Throws TypeError when property 'rows' is an array, but contains elements that are not arrays`)

  // [18] *****************************************************************************************
  data = { rows, labelMap: null }
  t.throws(() => { toDocuments(data) }, TypeError, `[18] Throws TypeError when property 'labelMap' is null`)

  // [19] *****************************************************************************************
  data = { rows, labelMap: {} }
  t.throws(() => { toDocuments(data) }, TypeError, `[19] Throws TypeError when property 'labelMap' is an object`)

  // [20] *****************************************************************************************
  data = { rows, labelMap: '12' }
  t.throws(() => { toDocuments(data) }, TypeError, `[20] Throws TypeError when property 'labelMap' is a string`)

  // [21] *****************************************************************************************
  data = { rows, labelMap: 12 }
  t.throws(() => { toDocuments(data) }, TypeError, `[21] Throws TypeError when property 'labelMap' is a number`)

  // [22] *****************************************************************************************
  data = { rows, labelMap: [] }
  t.throws(() => { toDocuments(data) }, TypeError, `[22] Throws TypeError when property 'labelMap' is an empty array`)

  // [23] *****************************************************************************************
  data = { rows, labelMap: [100, { field: 'belopp' }] }
  t.throws(() => { toDocuments(data) }, TypeError, `[23] Throws TypeError when property 'labelMap' is an array, but contains elements that are not objects`)

  // [24] *****************************************************************************************
  data = { rows, labelMap: [{ key: 'Ränta', field: 'ränta(kr)' }, { key: 'Belopp' }] }
  t.throws(() => { toDocuments(data) }, TypeError, `[24] Throws TypeError when property 'labelMap' is an array of objects, but not all objects have a property 'field'`)

  // [25] *****************************************************************************************
  data = { rows, labelMap: [{ key: 'Ränta', field: 'ränta(kr)' }, { key: 'Belopp', field: 3000 }] }
  t.throws(() => { toDocuments(data) }, TypeError, `[25] Throws TypeError when property 'labelMap' is an array of objects, but not all 'field' properties are strings`)

  // [26] *****************************************************************************************
  data = { rows, labelMap, fieldInject: { BELOPP: 12 } }
  t.throws(() => { toDocuments(data) }, RangeError, `[26] Throws RangeError when property 'fieldInject' given same name as a scraped field`)

  // [27] *****************************************************************************************
  data = { rows, labelMap, fieldInject: null }
  t.throws(() => { toDocuments(data) }, TypeError, `[27] Throws TypeError when property 'fieldInject' is null`)

  // [28] *****************************************************************************************
  data = { rows, labelMap, fieldInject: [] }
  t.throws(() => { toDocuments(data) }, TypeError, `[28] Throws TypeError when property 'fieldInject' is an array`)

  // [29] *****************************************************************************************
  data = { rows, labelMap, fieldInject: '12' }
  t.throws(() => { toDocuments(data) }, TypeError, `[29] Throws TypeError when property 'fieldInject' is a string`)

  // [30] *****************************************************************************************
  data = { rows, labelMap, fieldInject: 12 }
  t.throws(() => { toDocuments(data) }, TypeError, `[30] Throws TypeError when property 'fieldInject' is a number`)

  t.end()
})
