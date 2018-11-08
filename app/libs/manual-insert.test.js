const { test } = require('tap')
const manualInsert = require('./manual-insert')
const ValidationError = require('../errors/validation-error')

const keysVals = [
  { key: 'löptid (d)', value: 30 },
  { key: 'leverantörsId', value: 1 }
]
const wanted = {
  'löptid (d)': 30,
  leverantörsId: 1
}

test('manualInsert() invoked with valid arguments', (t) => {
  let failVals
  t.throws(() => { manualInsert() }, ReferenceError, `[01] Throws ReferenceError when called without argument`)
  t.throws(() => { manualInsert(null) }, TypeError, `[02] Throws TypeError when passed null as argument`)
  t.throws(() => { manualInsert({}) }, TypeError, `[03] Throws TypeError when passed an object as argument`)
  t.throws(() => { manualInsert(12) }, TypeError, `[04] Throws TypeError when passed a number as argument`)
  t.throws(() => { manualInsert('12') }, TypeError, `[05] Throws TypeError when passed a string as argument`)
  t.throws(() => { manualInsert(() => {}) }, TypeError, `[06] Throws TypeError when passed a function as argument`)
  t.throws(() => { manualInsert(Promise.resolve(1)) }, TypeError, `[07] Throws TypeError when passed a Promise as argument`)
  t.same(manualInsert([]), {}, `[08] Returns an object when passed an empty array`)
  t.same(manualInsert(keysVals), wanted, `[09] Returns an object when passed an array of valid objects`)
  failVals = [...keysVals, null]
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[10] Throws ValidationError when the array passed to function contains a null`)
  failVals = [...keysVals, 12]
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[12] Throws ValidationError when the array passed to function contains a number`)
  failVals = [...keysVals, '12']
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[12] Throws ValidationError when the array passed to function contains a string`)
  failVals = [...keysVals, []]
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[13] Throws ValidationError when the array passed to function contains an array`)
  failVals = [...keysVals, () => {}]
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[14] Throws ValidationError when the array passed to function contains a function`)
  failVals = [...keysVals, { key: 'ränta' }]
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[15] Throws ValidationError when the array passed to function has an object that doesn't have the property 'value'`)
  failVals = [...keysVals, { value: 10 }]
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[16] Throws ValidationError when the array passed to function has an object that doesn't have the property 'key'`)
  failVals = [...keysVals, { key: 'ränta', value: 10, val: 12 }]
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[17] Throws ValidationError when the array passed to function has an object that has an unallowed property (not 'key' or 'value')`)
  failVals = [...keysVals, { key: null, value: 15 }]
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[18] Throws ValidationError when the array passed to function has an object where the type of the value of property 'key' is null`)
  failVals = [...keysVals, { key: 10, value: 15 }]
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[19] Throws ValidationError when the array passed to function has an object where the type of the value of property 'key' is a number`)
  failVals = [...keysVals, { key: [], value: 15 }]
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[20] Throws ValidationError when the array passed to function has an object where the type of the value of property 'key' is an array`)
  failVals = [...keysVals, { key: {}, value: 15 }]
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[21] Throws ValidationError when the array passed to function has an object where the type of the value of property 'key' is an object`)
  failVals = [...keysVals, { key: () => {}, value: 15 }]
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[22] Throws ValidationError when the array passed to function has an object where the type of the value of property 'key' is a function`)
  failVals = [...keysVals, { key: 'ränta', value: null }]
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[23] Throws ValidationError when the array passed to function has an object where the type of the value of property 'value' is null`)
  failVals = [...keysVals, { key: 'ränta', value: [] }]
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[24] Throws ValidationError when the array passed to function has an object where the type of the value of property 'value' is an array`)
  failVals = [...keysVals, { key: 'ränta', value: {} }]
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[25] Throws ValidationError when the array passed to function has an object where the type of the value of property 'value' is an object`)
  failVals = [...keysVals, { key: 'ränta', value: () => {} }]
  t.throws(() => { manualInsert(failVals) }, ValidationError, `[26] Throws ValidationError when the array passed to function has an object where the type of the value of property 'value' is a function`)
  t.end()
})
