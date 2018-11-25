const { test } = require('tap')
const labelsChanged = require('../lib/labels-changed')

const labels = ['Belopp', 'Uppl. avg', 'Fakt. avg', 'Ränta', 'Total', 'Eff. ränta', 'Nom. ränta']
const labelMap = [
  { field: 'amount', label: 'Belopp' },
  { field: 'contractingCost', label: 'Uppl. avg' },
  { field: 'invoiceFee', label: 'Fakt. avg' },
  { field: 'interestToPay', label: 'Ränta' },
  { field: 'payback', label: 'Total' },
  { field: 'effectiveInterestRate', label: 'Eff. ränta' },
  { field: 'interestRate', label: 'Nom. ränta' }
]

let badLabels
let badLabelMap

test('labelsChanged({ labels, labelMap })', (t) => {
  t.throws(() => { labelsChanged() }, TypeError, `[01] Throws TypeError when called with no arguments`)

  t.throws(() => { labelsChanged({}) }, TypeError, `[02] Throws TypeError when called with an empty object`) // eslint-disable-line no-empty-pattern

  t.throws(() => { labelsChanged({ labels }) }, TypeError, `[03] Throws TypeError when called without property 'labelMap' in object passed`)

  t.throws(() => { labelsChanged({ labelMap }) }, TypeError, `[04] Throws TypeError when called without property 'labels' in object passed`)

  badLabels = 'Belopp'
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, TypeError, `[05] Throws TypeError when property 'labels' is a string`)

  badLabels = 12
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, TypeError, `[06] Throws TypeError when property 'labels' is a number`)

  badLabels = {}
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, TypeError, `[07] Throws TypeError when property 'labels' is an object`)

  badLabels = () => {}
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, TypeError, `[08] Throws TypeError when property 'labels' is a function`)

  badLabels = Promise.resolve(1)
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, TypeError, `[09] Throws TypeError when property 'labels' is a promise`)

  badLabels = true
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, TypeError, `[10] Throws TypeError when property 'labels' is a boolean`)

  badLabels = null
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, TypeError, `[11] Throws TypeError when property 'labels' is null`)

  badLabels = [...labels]
  badLabels[0] = 12
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, TypeError, `[12] Throws TypeError when property 'labels' is an array having a number element`)

  badLabelMap = 'Belopp'
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[13] Throws TypeError when property 'labelMap' is a string`)

  badLabelMap = 12
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[14] Throws TypeError when property 'labelMap' is a number`)

  badLabelMap = {}
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[15] Throws TypeError when property 'labelMap' is an object`)

  badLabelMap = () => {}
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[16] Throws TypeError when property 'labelMap' is a function`)

  badLabelMap = Promise.resolve(1)
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[17] Throws TypeError when property 'labelMap' is a promise`)

  badLabelMap = true
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[18] Throws TypeError when property 'labelMap' is a boolean`)

  badLabelMap = null
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[19] Throws TypeError when property 'labelMap' is null`)

  badLabelMap = [...labelMap]
  badLabelMap[0] = { field: 'amount' }
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[20] Throws TypeError when property 'labelMap' is an array having an object without property 'label'`)

  badLabelMap = [...labelMap]
  badLabelMap[0] = { field: 'amount', label: 12 }
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[21] Throws TypeError when property 'labelMap' is an array having an object where property 'label' is a number`)

  t.type(labelsChanged({ labels, labelMap }), 'boolean', `[22] Returns a boolean when given valid arguments`)

  t.equal(labelsChanged({ labels, labelMap }), false, `[23] Returns false when given valid arguments and labels haven't changed`)

  badLabels = [...labels]
  badLabels[2] = 'Aviavgift'
  t.equal(labelsChanged({ labels: badLabels, labelMap }), true, `[24] Returns true when given valid arguments and there exists a label not matching correspinding label in map object`)

  badLabels = [...labels]
  badLabels.pop()
  t.equal(labelsChanged({ labels: badLabels, labelMap }), true, `[25] Returns true when nr of labels not equal to nr of labels in labelMap`)

  t.end()
})
