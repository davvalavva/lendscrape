const { test } = require('tap')
const VError = require('verror')
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
  t.throws(() => { labelsChanged() }, VError, `[01] Throws VError when called with no arguments`)

  // [02] *****************************************************************************************
  t.throws(() => { labelsChanged({}) }, VError, `[02] Throws VError when called with an empty object`) // eslint-disable-line no-empty-pattern

  // [03] *****************************************************************************************
  t.throws(() => { labelsChanged({ labels }) }, VError, `[03] Throws VError when called without property 'labelMap' in object passed`)

  // [04] *****************************************************************************************
  t.throws(() => { labelsChanged({ labelMap }) }, VError, `[04] Throws VError when called without property 'labels' in object passed`)

  // [05] *****************************************************************************************
  badLabels = 'Belopp'
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, VError, `[05] Throws VError when property 'labels' is a string`)

  // [06] *****************************************************************************************
  badLabels = 12
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, VError, `[06] Throws VError when property 'labels' is a number`)

  // [07] *****************************************************************************************
  badLabels = {}
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, VError, `[07] Throws VError when property 'labels' is an object`)

  // [08] *****************************************************************************************
  badLabels = () => {}
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, VError, `[08] Throws VError when property 'labels' is a function`)

  // [09] *****************************************************************************************
  badLabels = Promise.resolve(1)
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, VError, `[09] Throws VError when property 'labels' is a promise`)

  // [10] *****************************************************************************************
  badLabels = true
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, VError, `[10] Throws VError when property 'labels' is a boolean`)

  // [11] *****************************************************************************************
  badLabels = null
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, VError, `[11] Throws VError when property 'labels' is null`)

  // [12] *****************************************************************************************
  badLabels = [...labels]
  badLabels[0] = 12
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, VError, `[12] Throws VError when property 'labels' is an array having a number element`)

  // [13] *****************************************************************************************
  badLabelMap = 'Belopp'
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[13] Throws VError when property 'labelMap' is a string`)

  // [14] *****************************************************************************************
  badLabelMap = 12
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[14] Throws VError when property 'labelMap' is a number`)

  // [15] *****************************************************************************************
  badLabelMap = {}
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[15] Throws VError when property 'labelMap' is an object`)

  // [16] *****************************************************************************************
  badLabelMap = () => {}
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[16] Throws VError when property 'labelMap' is a function`)

  // [17] *****************************************************************************************
  badLabelMap = Promise.resolve(1)
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[17] Throws VError when property 'labelMap' is a promise`)

  // [18] *****************************************************************************************
  badLabelMap = true
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[18] Throws VError when property 'labelMap' is a boolean`)

  // [19] *****************************************************************************************
  badLabelMap = null
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[19] Throws VError when property 'labelMap' is null`)

  // [20] *****************************************************************************************
  badLabelMap = [...labelMap]
  badLabelMap[0] = { field: 'amount' }
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[20] Throws VError when property 'labelMap' is an array having an object without property 'label'`)

  // [21] *****************************************************************************************
  badLabelMap = [...labelMap]
  badLabelMap[0] = { field: 'amount', label: 12 }
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[21] Throws VError when property 'labelMap' is an array having an object where property 'label' is a number`)

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
