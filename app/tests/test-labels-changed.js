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
  t.throws(() => { labelsChanged({}) }, VError, `[02] Throws VError when called with an empty object`)

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
  badLabels = Promise.resolve(1)
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, VError, `[08] Throws VError when property 'labels' is a promise`)

  // [09] *****************************************************************************************
  badLabels = true
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, VError, `[09] Throws VError when property 'labels' is a boolean`)

  // [10] *****************************************************************************************
  badLabels = null
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, VError, `[10] Throws VError when property 'labels' is null`)

  // [11] *****************************************************************************************
  badLabels = [...labels]
  badLabels[0] = 12
  t.throws(() => { labelsChanged({ labels: badLabels, labelMap }) }, VError, `[11] Throws VError when property 'labels' is an array having a number element`)

  // [12] *****************************************************************************************
  badLabelMap = 'Belopp'
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[12] Throws VError when property 'labelMap' is a string`)

  // [13] *****************************************************************************************
  badLabelMap = 12
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[13] Throws VError when property 'labelMap' is a number`)

  // [14] *****************************************************************************************
  badLabelMap = {}
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[14] Throws VError when property 'labelMap' is an object`)

  // [15] *****************************************************************************************
  badLabelMap = Promise.resolve(1)
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[15] Throws VError when property 'labelMap' is a promise`)

  // [16] *****************************************************************************************
  badLabelMap = true
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[16] Throws VError when property 'labelMap' is a boolean`)

  // [17] *****************************************************************************************
  badLabelMap = null
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[17] Throws VError when property 'labelMap' is null`)

  // [18] *****************************************************************************************
  badLabelMap = [...labelMap]
  badLabelMap[0] = { field: 'amount' }
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[18] Throws VError when property 'labelMap' is an array having an object without property 'label'`)

  // [19] *****************************************************************************************
  badLabelMap = [...labelMap]
  badLabelMap[0] = { field: 'amount', label: 12 }
  t.throws(() => { labelsChanged({ labels, labelMap: badLabelMap }) }, VError, `[19] Throws VError when property 'labelMap' is an array having an object where property 'label' is a number`)

  // [20] *****************************************************************************************
  t.type(labelsChanged({ labels, labelMap }), 'boolean', `[20] Returns a boolean when given valid arguments`)

  // [21] *****************************************************************************************
  t.equal(labelsChanged({ labels, labelMap }), false, `[21] Returns false when given valid arguments and labels haven't changed`)

  // [22] *****************************************************************************************
  badLabels = [...labels]
  badLabels[2] = 'Aviavgift'
  t.equal(labelsChanged({ labels: badLabels, labelMap }), true, `[22] Returns true when given valid arguments and there exists a label not matching correspinding label in map object`)

  // [23] *****************************************************************************************
  badLabels = [...labels]
  badLabels.pop()
  t.equal(labelsChanged({ labels: badLabels, labelMap }), true, `[23] Returns true when nr of labels not equal to nr of labels in labelMap`)

  t.end()
})
