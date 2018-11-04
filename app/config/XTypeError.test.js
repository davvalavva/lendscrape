/* eslint-disable no-new */
/**
 * @file Tests for file {@link <install_folder>/config/XTypeError.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const XTypeError = require('./XTypeError')

test('XTypeError(code, message, fileName, expected, found)', (t) => {
  t.type(new XTypeError(100, 'message', 'file.js', 'string', 'Array'), XTypeError, `1] Returns instance of XTypeError when thrown with correctly set arguments`)
  t.type(new XTypeError(100, 'message', 'file.js', ['string', 'number'], 'Array'), XTypeError, `2] Returns instance of XTypeError when thrown with correctly set arguments`)
  t.throws(() => { new XTypeError() }, TypeError, `Throws TypeError when no arguments given`)
  t.throws(() => { new XTypeError(100) }, TypeError, `Throws TypeError when 2nd argument not given`)
  t.throws(() => { new XTypeError(100, 'message') }, TypeError, `Throws TypeError when 3rd argument not given`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js') }, TypeError, `Throws TypeError when 4th argument not given`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', 'Array') }, TypeError, `Throws TypeError when 5th argument not given`)
  t.throws(() => { new XTypeError(null, 'message', 'file.js') }, TypeError, `Throws TypeError when 1st argument is null`)
  t.throws(() => { new XTypeError(undefined, 'message', 'file.js') }, TypeError, `Throws TypeError when 1st argument is undefined`)
  t.throws(() => { new XTypeError('100', 'message', 'file.js') }, TypeError, `Throws TypeError when 1st argument is a String`)
  t.throws(() => { new XTypeError([], 'message', 'file.js') }, TypeError, `Throws TypeError when 1st argument is an Array`)
  t.throws(() => { new XTypeError({}, 'message', 'file.js') }, TypeError, `Throws TypeError when 1st argument is an Object`)
  t.throws(() => { new XTypeError(() => {}, 'message', 'file.js') }, TypeError, `Throws TypeError when 1st argument is a Function`)
  t.throws(() => { new XTypeError(Promise.resolve(1), 'message', 'file.js') }, TypeError, `Throws TypeError when 1st argument is a Promise`)
  t.throws(() => { new XTypeError(100, null, 'file.js') }, TypeError, `Throws TypeError when 2nd argument is null`)
  t.throws(() => { new XTypeError(100, undefined, 'file.js') }, TypeError, `Throws TypeError when 2nd argument is undefined`)
  t.throws(() => { new XTypeError(100, 100, 'file.js') }, TypeError, `Throws TypeError when 2nd argument is a Number`)
  t.throws(() => { new XTypeError(100, [], 'file.js') }, TypeError, `Throws TypeError when 2nd argument is an Array`)
  t.throws(() => { new XTypeError(100, {}, 'file.js') }, TypeError, `Throws TypeError when 2nd argument is an Object`)
  t.throws(() => { new XTypeError(100, () => {}, 'file.js') }, TypeError, `Throws TypeError when 2nd argument is a Function`)
  t.throws(() => { new XTypeError(100, Promise.resolve(1), 'file.js') }, TypeError, `Throws TypeError when 2nd argument is a Promise`)
  t.throws(() => { new XTypeError(100, 'message', null) }, TypeError, `Throws TypeError when 3rd argument is null`)
  t.throws(() => { new XTypeError(100, 'message', undefined) }, TypeError, `Throws TypeError when 3rd argument is undefined`)
  t.throws(() => { new XTypeError(100, 'message', 100) }, TypeError, `Throws TypeError when 3rd argument is a Number`)
  t.throws(() => { new XTypeError(100, 'message', []) }, TypeError, `Throws TypeError when 3rd argument is an Array`)
  t.throws(() => { new XTypeError(100, 'message', {}) }, TypeError, `Throws TypeError when 3rd argument is an Object`)
  t.throws(() => { new XTypeError(100, 'message', () => {}) }, TypeError, `Throws TypeError when 3rd argument is a Function`)
  t.throws(() => { new XTypeError(100, 'message', Promise.resolve(1)) }, TypeError, `Throws TypeError when 3rd argument is a Promise`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', null) }, TypeError, `Throws TypeError when 4th argument is null`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', undefined) }, TypeError, `Throws TypeError when 4th argument is undefined`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', 100) }, TypeError, `Throws TypeError when 4th argument is a Number`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', {}) }, TypeError, `Throws TypeError when 4th argument is an Object`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', [], 'Array') }, TypeError, `Throws TypeError array in 4th is empty`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', ['number', 12], 'Array') }, TypeError, `Throws TypeError when array in 4th argument has an element that is a number`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', ['number', null], 'Array') }, TypeError, `Throws TypeError when array in 4th argument has an element that is a null`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', ['number', undefined], 'Array') }, TypeError, `Throws TypeError when array in 4th argument has an element that is a undefined`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', ['number', []], 'Array') }, TypeError, `Throws TypeError when array in 4th argument has an element that is an array`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', ['number', {}], 'Array') }, TypeError, `Throws TypeError when array in 4th argument has an element that is an object`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', () => {}) }, TypeError, `Throws TypeError when 4th argument is a Function`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', Promise.resolve(1)) }, TypeError, `Throws TypeError when 4th argument is a Promise`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', 'Array', null) }, TypeError, `Throws TypeError when 5th argument is null`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', 'Array', undefined) }, TypeError, `Throws TypeError when 5th argument is undefined`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', 'Array', 100) }, TypeError, `Throws TypeError when 5th argument is a Number`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', 'Array', []) }, TypeError, `Throws TypeError when 5th argument is an Array`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', 'Array', {}) }, TypeError, `Throws TypeError when 5th argument is an Object`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', 'Array', () => {}) }, TypeError, `Throws TypeError when 5th argument is a Function`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', 'Array', Promise.resolve(1)) }, TypeError, `Throws TypeError when 5th argument is a Promise`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', 'triangle', 'Object') }, RangeError, `Throws RangeError when 4th argument as string value doesn't match any known type (using 'type-name' lib)`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', 'number', 'circle') }, RangeError, `Throws RangeError when 5th argument as string value doesn't match any known type (using 'type-name' lib)`)
  t.throws(() => { new XTypeError(100, 'message', 'file.js', ['triangle', 'number'], 'Object') }, RangeError, `Throws RangeError when not all strings values for array in 4th argument match a known type (using 'type-name' lib)`)
  t.throws(() => { new XTypeError(-983, 'message', 'file.js') }, RangeError, `Throws RangeError when 1st argument is given a Number of a non-existing code`)
  t.throws(() => { new XTypeError(100, 'OK', 'file.js') }, Error, `Throws Error when 2nd argument is given a string less than 3 characters`)
  t.throws(() => { new XTypeError(100, 'message', '') }, Error, `Throws Error when 3rd argument is given an empty string`)
  t.end()
})
