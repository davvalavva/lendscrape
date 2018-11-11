const { test } = require('tap')
const labelsChanged = require('./labels-changed')

const headers = [
  'Belopp',
  'Uppl. avg',
  'Fakt. avg',
  'Ränta',
  'Total',
  'Eff. ränta',
  'Nom. ränta'
]
const changedHeaders = [...headers]
changedHeaders[2] = 'Aviavgift'
const labelMap = [
  { field: 'belopp', key: 'Belopp' },
  { field: 'uppl.avg', key: 'Uppl. avg' },
  { field: 'fakt.avg', key: 'Fakt. avg' },
  { field: 'ränta (kr)', key: 'Ränta' },
  { field: 'betala totalt', key: 'Total' },
  { field: 'eff. ränta (%)', key: 'Eff. ränta' },
  { field: 'nom. ränta (%)', key: 'Nom. ränta' }
]

test('labelsChanged(headers, labelMap)', (t) => {
  t.type(labelsChanged(headers, labelMap), 'boolean', `[01] Returns a boolean when given valid arguments`)
  t.same(labelsChanged(headers, labelMap), false, `[02] Returns false when given valid arguments and headers haven't changed`)
  t.same(labelsChanged(changedHeaders, labelMap), true, `[03] Returns true when given valid arguments and headers have changed`)
  t.throws(() => { labelsChanged() }, TypeError, `[04] Throws TypeError when called with no arguments`)
  t.throws(() => { labelsChanged(headers) }, TypeError, `[05] Throws TypeError when called without second argument`)
  t.throws(() => { labelsChanged({}, labelMap) }, TypeError, `[06] Throws TypeError when first argument is an object`)
  t.throws(() => { labelsChanged(() => {}, labelMap) }, TypeError, `[07] Throws TypeError when first argument is a function`)
  t.throws(() => { labelsChanged(12, labelMap) }, TypeError, `[08] Throws TypeError when first argument is a number`)
  t.throws(() => { labelsChanged('12', labelMap) }, TypeError, `[09] Throws TypeError when first argument is a string`)
  t.throws(() => { labelsChanged(null, labelMap) }, TypeError, `[10] Throws TypeError when first argument is null`)
  t.throws(() => { labelsChanged(undefined, labelMap) }, TypeError, `[11] Throws TypeError when first argument is undefined`)
  t.throws(() => { labelsChanged(headers, {}) }, TypeError, `[12] Throws TypeError when second argument is an object`)
  t.throws(() => { labelsChanged(headers, () => {}) }, TypeError, `[13] Throws TypeError when second argument is a function`)
  t.throws(() => { labelsChanged(headers, 12) }, TypeError, `[14] Throws TypeError when second argument is a number`)
  t.throws(() => { labelsChanged(headers, '12') }, TypeError, `[15] Throws TypeError when second argument is a string`)
  t.throws(() => { labelsChanged(headers, null) }, TypeError, `[16] Throws TypeError when second argument is null`)
  t.throws(() => { labelsChanged(headers, undefined) }, TypeError, `[17] Throws TypeError when second argument is undefined`)
  t.end()
})
