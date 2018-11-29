const { test } = require('tap')
const tableToDocs = require('../lib/to-documents')

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

test('tableToDocs({ rows, labelMap })', (t) => {
  // [01] *****************************************************************************************
  let data = { rows, labelMap }
  t.type(tableToDocs(data), 'object', `[01] returns a value of type Object when validation succeeds`)

  // [02] *****************************************************************************************
  t.strictSame(tableToDocs(data), expected, `[02] returns expected object when validation succeeds`)

  // [03] *****************************************************************************************
  t.throws(() => { tableToDocs() }, TypeError, `[03] Throws TypeError when called without any argument`)

  // [04] *****************************************************************************************
  t.throws(() => { tableToDocs(null) }, TypeError, `[04] Throws TypeError when argument is null`)

  // [05] *****************************************************************************************
  t.throws(() => { tableToDocs([]) }, TypeError, `[05] Throws TypeError when argument is an array`)

  // [06] *****************************************************************************************
  t.throws(() => { tableToDocs(() => {}) }, TypeError, `[06] Throws TypeError when argument is an function`)

  // [07] *****************************************************************************************
  t.throws(() => { tableToDocs('abc') }, TypeError, `[07] Throws TypeError when argument is a string`)

  // [08] *****************************************************************************************
  t.throws(() => { tableToDocs(12) }, TypeError, `[08] Throws TypeError when argument is a number`)

  // [09] *****************************************************************************************
  data = { labelMap }
  t.throws(() => { tableToDocs(data) }, TypeError, `[09] Throws TypeError when property 'rows' missing in object passed to function`)

  // [10] *****************************************************************************************
  data = { rows }
  t.throws(() => { tableToDocs(data) }, TypeError, `[10] Throws TypeError when property 'labelMap' missing in object passed to function`)

  // [11] *****************************************************************************************
  data = { rows: null, labelMap }
  t.throws(() => { tableToDocs(data) }, TypeError, `[11] Throws TypeError when property 'rows' in object passed to function is null`)

  // [12] *****************************************************************************************
  data = { rows: {}, labelMap }
  t.throws(() => { tableToDocs(data) }, TypeError, `[12] Throws TypeError when property 'rows' in object passed to function is an object`)

  // [13] *****************************************************************************************
  data = { rows: 'abc', labelMap }
  t.throws(() => { tableToDocs(data) }, TypeError, `[13] Throws TypeError when property 'rows' in object passed to function is a string`)

  // [14] *****************************************************************************************
  data = { rows: 12, labelMap }
  t.throws(() => { tableToDocs(data) }, TypeError, `[14] Throws TypeError when property 'rows' in object passed to function is a number`)

  // [15] *****************************************************************************************
  data = { rows: [], labelMap }
  t.throws(() => { tableToDocs(data) }, TypeError, `[15] Throws TypeError when property 'rows' in object passed to function is an empty array`)

  // [16] *****************************************************************************************
  data = { rows: [[12], 12], labelMap }
  t.throws(() => { tableToDocs(data) }, TypeError, `[16] Throws TypeError when property 'rows' in object passed to function is an array, but contains elements that are not (sub)arrays`)

  // [17] *****************************************************************************************
  data = { rows, labelMap: null }
  t.throws(() => { tableToDocs(data) }, TypeError, `[17] Throws TypeError when property 'labelMap' in object passed to function is null`)

  // [18] *****************************************************************************************
  data = { rows, labelMap: {} }
  t.throws(() => { tableToDocs(data) }, TypeError, `[18] Throws TypeError when property 'labelMap' in object passed to function is an object`)

  // [19] *****************************************************************************************
  data = { rows, labelMap: '12' }
  t.throws(() => { tableToDocs(data) }, TypeError, `[19] Throws TypeError when property 'labelMap' in object passed to function is a string`)

  // [20] *****************************************************************************************
  data = { rows, labelMap: 12 }
  t.throws(() => { tableToDocs(data) }, TypeError, `[20] Throws TypeError when property 'labelMap' in object passed to function is a number`)

  // [21] *****************************************************************************************
  data = { rows, labelMap: [] }
  t.throws(() => { tableToDocs(data) }, TypeError, `[21] Throws TypeError when property 'labelMap' in object passed to function is an empty array`)

  // [22] *****************************************************************************************
  data = { rows, labelMap: [100, { field: 'belopp' }] }
  t.throws(() => { tableToDocs(data) }, TypeError, `[22] Throws TypeError when property 'labelMap' in object passed to function is an array, but contains elements that are not objects`)

  // [23] *****************************************************************************************
  data = { rows, labelMap: [{ key: 'Ränta', field: 'ränta(kr)' }, { key: 'Belopp' }] }
  t.throws(() => { tableToDocs(data) }, TypeError, `[23] Throws TypeError when property 'labelMap' in object passed to function is an array of objects, but not all objects have a property 'field'`)

  // [24] *****************************************************************************************
  data = { rows, labelMap: [{ key: 'Ränta', field: 'ränta(kr)' }, { key: 'Belopp', field: 3000 }] }
  t.throws(() => { tableToDocs(data) }, TypeError, `[24] Throws TypeError when property 'labelMap' in object passed to function is an array of objects, but not all 'field' properties are strings`)

  // [25] *****************************************************************************************
  t.throws(() => tableToDocs(null, { debug: 1, log: false }), TypeError, `[25] tableToDocs(null, { debug: 1, log: false }) throws TypeError (and should output error to terminal but no log error)`)

  // [26] *****************************************************************************************
  t.throws(() => tableToDocs(null, { debug: 1, log: true }), TypeError, `[26] tableToDocs(null, { debug: 1, log: true }) throws TypeError (and should output error to terminal and log error)`)

  // [27] *****************************************************************************************
  t.throws(() => tableToDocs(null, { debug: 0, log: true }), TypeError, `[27] tableToDocs(null, { debug: 0, log: true }) throws TypeError (and should log error but not output error to terminal)`)

  t.end()
})