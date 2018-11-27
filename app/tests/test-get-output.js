const { test } = require('tap')
const getOutput = require('../errors/print-error/get-output')

test('getOutput(errObj)', (t) => {
  // [01] *****************************************************************************************
  t.type(getOutput(new Error('errMessage')), 'string', `[01] Returns a string when passed an Error instance`)

  // [02] *****************************************************************************************
  t.type(getOutput(new SyntaxError('errMessage')), 'string', `[02] Returns a string when passed an SyntaxError instance`)

  // [03] *****************************************************************************************
  t.type(getOutput(new TypeError('errMessage')), 'string', `[03] Returns a string when passed an TypeError instance`)

  // [04] *****************************************************************************************
  t.type(getOutput(new ReferenceError('errMessage')), 'string', `[04] Returns a string when passed an ReferenceError instance`)

  // [05] *****************************************************************************************
  t.type(getOutput(new RangeError('errMessage')), 'string', `[05] Returns a string when passed an RangeError instance`)

  // [06] *****************************************************************************************
  t.type(getOutput(new URIError('errMessage')), 'string', `[06] Returns a string when passed an URIError instance`)

  // [07] *****************************************************************************************
  t.type(getOutput(new EvalError('errMessage')), 'string', `[07] Returns a string when passed an EvalError instance`)

  // [08] *****************************************************************************************
  t.throws(() => { getOutput() }, TypeError, `[08] Throws TypeError when no arguments given`)

  // [09] *****************************************************************************************
  t.throws(() => { getOutput(null) }, TypeError, `[09] Throws TypeError when 1st argument is null`)

  // [10] *****************************************************************************************
  t.throws(() => { getOutput(undefined) }, TypeError, `[10] Throws TypeError when 1st argument is undefined`)

  // [11] *****************************************************************************************
  t.throws(() => { getOutput(301) }, TypeError, `[11] Throws TypeError when 1st argument is a Number`)

  // [12] *****************************************************************************************
  t.throws(() => { getOutput([]) }, TypeError, `[12] Throws TypeError when 1st argument is an Array`)

  // [13] *****************************************************************************************
  t.throws(() => { getOutput({}) }, TypeError, `[13] Throws TypeError when 1st argument is an Object`)

  // [14] *****************************************************************************************
  t.throws(() => { getOutput(() => {}) }, TypeError, `[14] Throws TypeError when 1st argument is a Function`)

  // [15] *****************************************************************************************
  t.throws(() => { getOutput(Promise.resolve(1)) }, TypeError, `[15] Throws TypeError when 1st argument is a Promise`)

  // [16] *****************************************************************************************
  t.throws(() => { getOutput('') }, Error, `[16] Throws Error when 1st argument is given an empty string`)

  t.end()
})
