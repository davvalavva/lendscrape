const { test } = require('tap')
const VError = require('verror')
const toDocuments = require('../lib/to-documents')

const labelMap = JSON.parse(`
[
  { "label": "Belopp",     "field": "belopp"        },
  { "label": "Uppl. avg",  "field": "uppl.avg"      },
  { "label": "Fakt. avg",  "field": "fakt.avg"      },
  { "label": "Ränta",      "field": "ränta(kr)"     },
  { "label": "Total",      "field": "betala-totalt" },
  { "label": "Eff. ränta", "field": "eff.-ränta(%)" },
  { "label": "Nom. ränta", "field": "nom.-ränta(%)" }
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
  t.throws(() => { toDocuments() }, VError, `[04] Throws VError when given no argument`)

  // [05] *****************************************************************************************
  t.throws(() => { toDocuments(null) }, VError, `[05] Throws VError when given null`)

  // [06] *****************************************************************************************
  t.throws(() => { toDocuments([]) }, VError, `[06] Throws VError when given an array`)

  // [07] *****************************************************************************************
  t.throws(() => { toDocuments(() => {}) }, VError, `[07] Throws VError when given a function`)

  // [08] *****************************************************************************************
  t.throws(() => { toDocuments('abc') }, VError, `[08] Throws VError when given a string`)

  // [09] *****************************************************************************************
  t.throws(() => { toDocuments(12) }, VError, `[09] Throws VError when given a number`)

  // [10] *****************************************************************************************
  data = { labelMap }
  t.throws(() => { toDocuments(data) }, VError, `[10] Throws VError when property 'rows' is missing`)

  // [11] *****************************************************************************************
  data = { rows }
  t.throws(() => { toDocuments(data) }, VError, `[11] Throws VError when property 'labelMap' is missing`)

  // [12] *****************************************************************************************
  data = { rows: null, labelMap }
  t.throws(() => { toDocuments(data) }, VError, `[12] Throws VError when property 'rows' is null`)

  // [13] *****************************************************************************************
  data = { rows: {}, labelMap }
  t.throws(() => { toDocuments(data) }, VError, `[13] Throws VError when property 'rows' is an object`)

  // [14] *****************************************************************************************
  data = { rows: 'abc', labelMap }
  t.throws(() => { toDocuments(data) }, VError, `[14] Throws VError when property 'rows' is a string`)

  // [15] *****************************************************************************************
  data = { rows: 12, labelMap }
  t.throws(() => { toDocuments(data) }, VError, `[15] Throws VError when property 'rows' is a number`)

  // [16] *****************************************************************************************
  data = { rows: [], labelMap }
  t.throws(() => { toDocuments(data) }, VError, `[16] Throws VError when property 'rows' is an empty array`)

  // [17] *****************************************************************************************
  data = { rows: [[12], 12], labelMap }
  t.throws(() => { toDocuments(data) }, VError, `[17] Throws VError when property 'rows' is an array, but contains elements that are not arrays`)

  // [18] *****************************************************************************************
  data = { rows: [[12], ['12']], labelMap }
  t.throws(() => { toDocuments(data) }, VError, `[18] Throws VError when property 'rows' is an array of arrays but contains elements that are not numbers`)

  // [19] *****************************************************************************************
  data = { rows, labelMap: null }
  t.throws(() => { toDocuments(data) }, VError, `[19] Throws VError when property 'labelMap' is null`)

  // [20] *****************************************************************************************
  data = { rows, labelMap: {} }
  t.throws(() => { toDocuments(data) }, VError, `[20] Throws VError when property 'labelMap' is an object`)

  // [21] *****************************************************************************************
  data = { rows, labelMap: '12' }
  t.throws(() => { toDocuments(data) }, VError, `[21] Throws VError when property 'labelMap' is a string`)

  // [22] *****************************************************************************************
  data = { rows, labelMap: 12 }
  t.throws(() => { toDocuments(data) }, VError, `[22] Throws VError when property 'labelMap' is a number`)

  // [23] *****************************************************************************************
  data = { rows, labelMap: [] }
  t.throws(() => { toDocuments(data) }, VError, `[23] Throws VError when property 'labelMap' is an empty array`)

  // [24] *****************************************************************************************
  data = { rows, labelMap: [100, { field: 'belopp' }] }
  t.throws(() => { toDocuments(data) }, VError, `[24] Throws VError when property 'labelMap' is an array, but contains elements that are not objects`)

  // [25] *****************************************************************************************
  data = { rows, labelMap: [{ label: ' Belopp' }, { field: 'belopp' }] }
  t.throws(() => { toDocuments(data) }, VError, `[25] Throws VError when property 'labelMap' is an array of objects, but not all objects have a 'field' property`)

  // [26] *****************************************************************************************
  data = { rows, labelMap: [{ label: 'Ränta', field: 'ränta(kr)' }, { label: 'Belopp' }] }
  t.throws(() => { toDocuments(data) }, VError, `[26] Throws VError when property 'labelMap' is an array of objects, but not all objects have a property 'field'`)

  // [27] *****************************************************************************************
  data = { rows, labelMap: [{ label: 'Ränta', field: 'ränta(kr)' }, { label: 'Belopp', field: 3000 }] }
  t.throws(() => { toDocuments(data) }, VError, `[27] Throws VError when property 'labelMap' is an array of objects, but there exists 'field' property values that are not strings`)

  // [28] *****************************************************************************************
  data = { rows, labelMap, fieldInject: { BELOPP: 12 } }
  t.throws(() => { toDocuments(data) }, VError, `[28] Throws VError when property 'fieldInject' given same name (case insensitive) as a scraped field`)

  // [29] *****************************************************************************************
  data = { rows, labelMap, fieldInject: null }
  t.throws(() => { toDocuments(data) }, VError, `[29] Throws VError when property 'fieldInject' is null`)

  // [30] *****************************************************************************************
  data = { rows, labelMap, fieldInject: [] }
  t.throws(() => { toDocuments(data) }, VError, `[30] Throws VError when property 'fieldInject' is an array`)

  // [31] *****************************************************************************************
  data = { rows, labelMap, fieldInject: '12' }
  t.throws(() => { toDocuments(data) }, VError, `[31] Throws VError when property 'fieldInject' is a string`)

  // [32] *****************************************************************************************
  data = { rows, labelMap, fieldInject: 12 }
  t.throws(() => { toDocuments(data) }, VError, `[32] Throws VError when property 'fieldInject' is a number`)

  t.end()
})
