const { test } = require('tap')
const getOutputStandard = require('../errors/print-error/get-output-standard')

test('getOutputStandard(errObj)', (t) => {
  // [01] *****************************************************************************************
  t.type(getOutputStandard(new Error('errMessage')), 'string', `[01] Returns a string when passed an Error instance`)

  // [02] *****************************************************************************************
  t.type(getOutputStandard(new SyntaxError('errMessage')), 'string', `[02] Returns a string when passed an SyntaxError instance`)

  // [03] *****************************************************************************************
  t.type(getOutputStandard(new TypeError('errMessage')), 'string', `[03] Returns a string when passed an TypeError instance`)

  // [04] *****************************************************************************************
  t.type(getOutputStandard(new ReferenceError('errMessage')), 'string', `[04] Returns a string when passed an ReferenceError instance`)

  // [05] *****************************************************************************************
  t.type(getOutputStandard(new RangeError('errMessage')), 'string', `[05] Returns a string when passed an RangeError instance`)

  // [06] *****************************************************************************************
  t.type(getOutputStandard(new URIError('errMessage')), 'string', `[06] Returns a string when passed an URIError instance`)

  // [07] *****************************************************************************************
  t.type(getOutputStandard(new EvalError('errMessage')), 'string', `[07] Returns a string when passed an EvalError instance`)

  // [08] *****************************************************************************************
  t.throws(() => { getOutputStandard() }, TypeError, `[08] Throws TypeError when no arguments given`)

  // [09] *****************************************************************************************
  t.throws(() => { getOutputStandard(null, 1) }, TypeError, `[09] Throws TypeError when 1st argument is null`)

  // [10] *****************************************************************************************
  t.throws(() => { getOutputStandard(undefined, 1) }, TypeError, `[10] Throws TypeError when 1st argument is undefined`)

  // [11] *****************************************************************************************
  t.throws(() => { getOutputStandard(301, 1) }, TypeError, `[11] Throws TypeError when 1st argument is a Number`)

  // [12] *****************************************************************************************
  t.throws(() => { getOutputStandard([], 1) }, TypeError, `[12] Throws TypeError when 1st argument is an Array`)

  // [13] *****************************************************************************************
  t.throws(() => { getOutputStandard({}, 1) }, TypeError, `[13] Throws TypeError when 1st argument is an Object`)

  // [14] *****************************************************************************************
  t.throws(() => { getOutputStandard(() => {}, 1) }, TypeError, `[14] Throws TypeError when 1st argument is a Function`)

  // [15] *****************************************************************************************
  t.throws(() => { getOutputStandard(Promise.resolve(1), 1) }, TypeError, `[15] Throws TypeError when 1st argument is a Promise`)

  t.end()
})
