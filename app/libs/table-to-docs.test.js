const { test } = require('tap')
const tableToDocs = require('./table-to-docs')
const ValidationError = require('../errors/validation-error')

const keyMap = JSON.parse(`
[
  { "key": "Belopp",     "mapped": "belopp"        },
  { "key": "Uppl. avg",  "mapped": "uppl.avg"      },
  { "key": "Fakt. avg",  "mapped": "fakt.avg"      },
  { "key": "Ränta",      "mapped": "ränta(kr)"     },
  { "key": "Total",      "mapped": "betala-totalt" },
  { "key": "Eff. ränta", "mapped": "eff.-ränta(%)" },
  { "key": "Nom. ränta", "mapped": "nom.-ränta(%)" }
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

test('tableToDocs({ rows, keyMap })', (t) => {
  let data = { rows, keyMap }
  t.type(tableToDocs(data), 'object', `[01] returns a value of type Object when validation succeeds`)
  t.same(tableToDocs(data), expected, `[02] returns expected object when validation succeeds`)
  t.throws(() => { tableToDocs() }, ReferenceError, `[03] Throws ReferenceError when called without any argument`)
  t.throws(() => { tableToDocs(null) }, TypeError, `[04] Throws TypeError when argument is null`)
  t.throws(() => { tableToDocs([]) }, TypeError, `[05] Throws TypeError when argument is an array`)
  t.throws(() => { tableToDocs(() => {}) }, TypeError, `[06] Throws TypeError when argument is an function`)
  t.throws(() => { tableToDocs('abc') }, TypeError, `[07] Throws TypeError when argument is a string`)
  t.throws(() => { tableToDocs(12) }, TypeError, `[08] Throws TypeError when argument is a number`)
  data = { keyMap }
  t.throws(() => { tableToDocs(data) }, ReferenceError, `[09] Throws ReferenceError when property 'rows' missing in object passed to function`)
  data = { rows }
  t.throws(() => { tableToDocs(data) }, ReferenceError, `[10] Throws ReferenceError when property 'keyMap' missing in object passed to function`)
  data = { rows: null, keyMap }
  t.throws(() => { tableToDocs(data) }, TypeError, `[11] Throws TypeError when property 'rows' in object passed to function is null`)
  data = { rows: {}, keyMap }
  t.throws(() => { tableToDocs(data) }, TypeError, `[12] Throws TypeError when property 'rows' in object passed to function is an object`)
  data = { rows: 'abc', keyMap }
  t.throws(() => { tableToDocs(data) }, TypeError, `[13] Throws TypeError when property 'rows' in object passed to function is a string`)
  data = { rows: 12, keyMap }
  t.throws(() => { tableToDocs(data) }, TypeError, `[14] Throws TypeError when property 'rows' in object passed to function is a number`)
  data = { rows: [], keyMap }
  t.throws(() => { tableToDocs(data) }, ValidationError, `[15] Throws ValidationError when property 'rows' in object passed to function is an empty array`)
  data = { rows: [[12], 12], keyMap }
  t.throws(() => { tableToDocs(data) }, TypeError, `[16] Throws TypeError when property 'rows' in object passed to function is an array, but contains elements that are not (sub)arrays`)
  data = { rows, keyMap: null }
  t.throws(() => { tableToDocs(data) }, TypeError, `[17] Throws TypeError when property 'keyMap' in object passed to function is null`)
  data = { rows, keyMap: {} }
  t.throws(() => { tableToDocs(data) }, TypeError, `[18] Throws TypeError when property 'keyMap' in object passed to function is an object`)
  data = { rows, keyMap: '12' }
  t.throws(() => { tableToDocs(data) }, TypeError, `[19] Throws TypeError when property 'keyMap' in object passed to function is a string`)
  data = { rows, keyMap: 12 }
  t.throws(() => { tableToDocs(data) }, TypeError, `[20] Throws TypeError when property 'keyMap' in object passed to function is a number`)
  data = { rows, keyMap: [] }
  t.throws(() => { tableToDocs(data) }, ValidationError, `[21] ValidationError TypeError when property 'keyMap' in object passed to function is an empty array`)
  data = { rows, keyMap: [100, { mapped: 'belopp' }] }
  t.throws(() => { tableToDocs(data) }, TypeError, `[22] Throws TypeError when property 'keyMap' in object passed to function is an array, but contains elements that are not objects`)
  data = { rows, keyMap: [{ key: 'Ränta', mapped: 'ränta(kr)' }, { key: 'Belopp' }] }
  t.throws(() => { tableToDocs(data) }, ReferenceError, `[22] Throws ReferenceError when property 'keyMap' in object passed to function is an array of objects, but not all objects have a property 'mapped'`)
  data = { rows, keyMap: [{ key: 'Ränta', mapped: 'ränta(kr)' }, { key: 'Belopp', mapped: 3000 }] }
  t.throws(() => { tableToDocs(data) }, TypeError, `[23] Throws TypeError when property 'keyMap' in object passed to function is an array of objects, but not all 'mapped' properties are strings`)

  t.end()
})
