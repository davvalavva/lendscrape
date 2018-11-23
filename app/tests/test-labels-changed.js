const { test } = require('tap')
const labelsChanged = require('../lib/labels-changed')
const ValidationError = require('../errors/validation-error')

const labels = [
  'Belopp',
  'Uppl. avg',
  'Fakt. avg',
  'Ränta',
  'Total',
  'Eff. ränta',
  'Nom. ränta'
]
const labelMap = [
  { field: 'amount', label: 'Belopp' },
  { field: 'contractingCost', label: 'Uppl. avg' },
  { field: 'invoiceFee', label: 'Fakt. avg' },
  { field: 'interestToPay', label: 'Ränta' },
  { field: 'payback', label: 'Total' },
  { field: 'effectiveInterestRate', label: 'Eff. ränta' },
  { field: 'interestRate', label: 'Nom. ränta' }
]

test('labelsChanged(labels, labelMap)', (t) => {
  t.type(labelsChanged(labels, labelMap), 'boolean', `[01] Returns a boolean when given valid arguments`)

  t.equal(labelsChanged(labels, labelMap), false, `[02] Returns false when given valid arguments and labels haven't changed`)

  const changedLabels = [...labels]
  changedLabels[2] = 'Aviavgift'
  t.equal(labelsChanged(changedLabels, labelMap), true, `[03] Returns true when given valid arguments and labels have changed`)

  t.throws(() => { labelsChanged() }, TypeError, `[04] Throws TypeError when called with no arguments`)

  t.throws(() => { labelsChanged(labels) }, TypeError, `[05] Throws TypeError when called without second argument`)

  t.throws(() => { labelsChanged({}, labelMap) }, TypeError, `[06] Throws TypeError when first argument isn't an array`)

  t.throws(() => { labelsChanged(labels, {}) }, TypeError, `[07] Throws TypeError when second argument isn't an array`)

  const invalidLabels = [...labels]
  invalidLabels[3] = 450
  t.throws(() => {
    labelsChanged(invalidLabels, labelMap)
  }, ValidationError, `[08] Throws ValidationError when array in first argument contains non-string element`)

  const invalidLabelMap1 = [...labelMap]
  invalidLabelMap1[0].additional_property = 'hello'
  t.throws(() => { labelsChanged(labels, invalidLabelMap1) }, ValidationError, `[09] Throws ValidationError when given invalid array in second argument`)

  const invalidLabelMap2 = [...labelMap]
  delete invalidLabelMap2[0].label
  t.throws(() => { labelsChanged(labels, invalidLabelMap2) }, ValidationError, `[10] Throws ValidationError when given invalid array in second argument`)

  const invalidLabelMap3 = [...labelMap]
  invalidLabelMap3[4].label = ['Total']
  t.throws(() => { labelsChanged(labels, invalidLabelMap3) }, ValidationError, `[11] Throws ValidationError when given invalid array in second argument`)

  t.end()
})
