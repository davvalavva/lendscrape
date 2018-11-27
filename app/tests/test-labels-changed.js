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
  // [01] *****************************************************************************************
  t.throws(() => { labelsChanged() }, TypeError, `[01] Throws TypeError when called with no arguments`)

  // [02] *****************************************************************************************
  t.throws(() => { labelsChanged({}) }, TypeError, `[02] Throws TypeError when called with an empty object`) // eslint-disable-line no-empty-pattern

  // [03] *****************************************************************************************
  t.throws(() => { labelsChanged({ labels }) }, TypeError, `[03] Throws TypeError when called without property 'labelMap' in object passed`)

  // [04] *****************************************************************************************
  t.throws(() => { labelsChanged({ labelMap }) }, TypeError, `[04] Throws TypeError when called without property 'labels' in object passed`)

  // [05] *****************************************************************************************
  badLabels = 'Belopp'
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, TypeError, `[05] Throws TypeError when property 'labels' is a string`)

  // [06] *****************************************************************************************
  badLabels = 12
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, TypeError, `[06] Throws TypeError when property 'labels' is a number`)

  // [07] *****************************************************************************************
  badLabels = {}
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, TypeError, `[07] Throws TypeError when property 'labels' is an object`)

  // [08] *****************************************************************************************
  badLabels = () => {}
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, TypeError, `[08] Throws TypeError when property 'labels' is a function`)

  // [09] *****************************************************************************************
  badLabels = Promise.resolve(1)
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, TypeError, `[09] Throws TypeError when property 'labels' is a promise`)

  // [10] *****************************************************************************************
  badLabels = true
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, TypeError, `[10] Throws TypeError when property 'labels' is a boolean`)

  // [11] *****************************************************************************************
  badLabels = null
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, TypeError, `[11] Throws TypeError when property 'labels' is null`)

  // [12] *****************************************************************************************
  badLabels = [...labels]
  badLabels[0] = 12
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, TypeError, `[12] Throws TypeError when property 'labels' is an array having a number element`)

  // [13] *****************************************************************************************
  badLabelMap = 'Belopp'
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[13] Throws TypeError when property 'labelMap' is a string`)

  // [14] *****************************************************************************************
  badLabelMap = 12
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[14] Throws TypeError when property 'labelMap' is a number`)

  // [15] *****************************************************************************************
  badLabelMap = {}
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[15] Throws TypeError when property 'labelMap' is an object`)

  // [16] *****************************************************************************************
  badLabelMap = () => {}
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[16] Throws TypeError when property 'labelMap' is a function`)

  // [17] *****************************************************************************************
  badLabelMap = Promise.resolve(1)
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[17] Throws TypeError when property 'labelMap' is a promise`)

  // [18] *****************************************************************************************
  badLabelMap = true
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[18] Throws TypeError when property 'labelMap' is a boolean`)

  // [19] *****************************************************************************************
  badLabelMap = null
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[19] Throws TypeError when property 'labelMap' is null`)

  // [20] *****************************************************************************************
  badLabelMap = [...labelMap]
  badLabelMap[0] = { field: 'amount' }
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[20] Throws TypeError when property 'labelMap' is an array having an object without property 'label'`)

  // [21] *****************************************************************************************
  badLabelMap = [...labelMap]
  badLabelMap[0] = { field: 'amount', label: 12 }
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, TypeError, `[21] Throws TypeError when property 'labelMap' is an array having an object where property 'label' is a number`)

  // [22] *****************************************************************************************
  t.type(labelsChanged({ labels, labelMap }), 'boolean', `[22] Returns a boolean when given valid arguments`)

  // [23] *****************************************************************************************
  t.equal(labelsChanged({ labels, labelMap }), false, `[23] Returns false when given valid arguments and labels haven't changed`)

  // [24] *****************************************************************************************
  badLabels = [...labels]
  badLabels[2] = 'Aviavgift'
  t.equal(labelsChanged({ labels: badLabels, labelMap }), true, `[24] Returns true when given valid arguments and there exists a label not matching correspinding label in map object`)

  // [25] *****************************************************************************************
  badLabels = [...labels]
  badLabels.pop()
  t.equal(labelsChanged({ labels: badLabels, labelMap }), true, `[25] Returns true when nr of labels not equal to nr of labels in labelMap`)

  t.end()
})
