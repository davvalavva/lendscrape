/* eslint-disable no-new */
/**
 * @file Tests for file {@link <install_folder>/config/ValidationError.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const ValidationError = require('./ValidationError')

test('ValidationError(code, message, fileName, scope)', (t) => {
  t.type(new ValidationError(100, 'message', 'file.js', { a: 1 }), ValidationError, `Returns instance of ValidationError when thrown with correctly set arguments`)
  t.throws(() => { new ValidationError() }, TypeError, `Throws TypeError when no arguments given`)
  t.throws(() => { new ValidationError(100) }, TypeError, `Throws TypeError when 2nd argument not given`)
  t.throws(() => { new ValidationError(100, 'message') }, TypeError, `Throws TypeError when 3rd argument not given`)
  t.throws(() => { new ValidationError(null, 'message', 'file.js', { a: 1 }) }, TypeError, `Throws TypeError when 1st argument is null`)
  t.throws(() => { new ValidationError(undefined, 'message', 'file.js', { a: 1 }) }, TypeError, `Throws TypeError when 1st argument is undefined`)
  t.throws(() => { new ValidationError('100', 'message', 'file.js', { a: 1 }) }, TypeError, `Throws TypeError when 1st argument is a String`)
  t.throws(() => { new ValidationError([], 'message', 'file.js', { a: 1 }) }, TypeError, `Throws TypeError when 1st argument is an Array`)
  t.throws(() => { new ValidationError({}, 'message', 'file.js', { a: 1 }) }, TypeError, `Throws TypeError when 1st argument is an Object`)
  t.throws(() => { new ValidationError(() => {}, 'message', 'file.js', { a: 1 }) }, TypeError, `Throws TypeError when 1st argument is a Function`)
  t.throws(() => { new ValidationError(Promise.resolve(1), 'message', 'file.js', { a: 1 }) }, TypeError, `Throws TypeError when 1st argument is a Promise`)
  t.throws(() => { new ValidationError(100, null, 'file.js', { a: 1 }) }, TypeError, `Throws TypeError when 2nd argument is null`)
  t.throws(() => { new ValidationError(100, undefined, 'file.js', { a: 1 }) }, TypeError, `Throws TypeError when 2nd argument is undefined`)
  t.throws(() => { new ValidationError(100, 100, 'file.js', { a: 1 }) }, TypeError, `Throws TypeError when 2nd argument is a Number`)
  t.throws(() => { new ValidationError(100, [], 'file.js', { a: 1 }) }, TypeError, `Throws TypeError when 2nd argument is an Array`)
  t.throws(() => { new ValidationError(100, {}, 'file.js', { a: 1 }) }, TypeError, `Throws TypeError when 2nd argument is an Object`)
  t.throws(() => { new ValidationError(100, () => {}, 'file.js', { a: 1 }) }, TypeError, `Throws TypeError when 2nd argument is a Function`)
  t.throws(() => { new ValidationError(100, Promise.resolve(1), 'file.js', { a: 1 }) }, TypeError, `Throws TypeError when 2nd argument is a Promise`)
  t.throws(() => { new ValidationError(100, 'message', null, { a: 1 }) }, TypeError, `Throws TypeError when 3rd argument is null`)
  t.throws(() => { new ValidationError(100, 'message', undefined, { a: 1 }) }, TypeError, `Throws TypeError when 3rd argument is undefined`)
  t.throws(() => { new ValidationError(100, 'message', 100, { a: 1 }) }, TypeError, `Throws TypeError when 3rd argument is a Number`)
  t.throws(() => { new ValidationError(100, 'message', [], { a: 1 }) }, TypeError, `Throws TypeError when 3rd argument is an Array`)
  t.throws(() => { new ValidationError(100, 'message', {}, { a: 1 }) }, TypeError, `Throws TypeError when 3rd argument is an Object`)
  t.throws(() => { new ValidationError(100, 'message', () => {}, { a: 1 }) }, TypeError, `Throws TypeError when 3rd argument is a Function`)
  t.throws(() => { new ValidationError(100, 'message', Promise.resolve(1), { a: 1 }) }, TypeError, `Throws TypeError when 3rd argument is a Promise`)
  t.throws(() => { new ValidationError(100, 'message', 'file.js', null) }, TypeError, `Throws TypeError when 4th argument is null`)
  t.throws(() => { new ValidationError(100, 'message', 'file.js', 100) }, TypeError, `Throws TypeError when 4th argument is a Number`)
  t.throws(() => { new ValidationError(100, 'message', 'file.js', '100') }, TypeError, `Throws TypeError when 4th argument is a String`)
  t.throws(() => { new ValidationError(100, 'message', 'file.js', []) }, TypeError, `Throws TypeError when 4th argument is an Array`)
  t.throws(() => { new ValidationError(100, 'message', 'file.js', () => {}) }, TypeError, `Throws TypeError when 4th argument is a Function`)
  t.throws(() => { new ValidationError(100, 'message', 'file.js', Promise.resolve(1)) }, TypeError, `Throws TypeError when 4th argument is a Promise`)
  t.throws(() => { new ValidationError(-983, 'message', 'file.js', { a: 1 }) }, RangeError, `Throws RangeError when 1st argument is given a Number of a non-existing code`)
  t.throws(() => { new ValidationError(100, 'OK', 'file.js', { a: 1 }) }, Error, `Throws Error when 2nd argument is given a string less than 3 characters`)
  t.throws(() => { new ValidationError(100, 'message', '', { a: 1 }) }, Error, `Throws Error when 3rd argument is given an empty string`)
  t.end()
})
