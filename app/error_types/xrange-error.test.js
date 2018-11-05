/* eslint-disable no-new */
/**
 * @file Tests for file {@link <install_folder>/error_types/xrange-error.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const XRangeError = require('./xrange-error')

test('XRangeError(code, message, fileName, type, range)', (t) => {
  t.type(new XRangeError(100, 'message', 'file.js', 'minmax', [0, 100]), XRangeError, `Returns instance of XRangeError when thrown with correctly set args`)
  t.throws(() => { new XRangeError() }, TypeError, `Throws TypeError when no args given`)
  t.throws(() => { new XRangeError(100) }, TypeError, `Throws TypeError when 2nd arg. not given`)
  t.throws(() => { new XRangeError(100, 'message') }, TypeError, `Throws TypeError when 3rd arg. not given`)
  t.throws(() => { new XRangeError(100, 'message', 'file.js') }, TypeError, `Throws TypeError when 4th arg. not given`)
  t.throws(() => { new XRangeError(100, 'message', 'file.js', 'enum') }, TypeError, `Throws TypeError when 5th arg. not given`)
  t.throws(() => { new XRangeError(null, 'message', 'file.js') }, TypeError, `Throws TypeError when 1st arg. is null`)
  t.throws(() => { new XRangeError(undefined, 'message', 'file.js') }, TypeError, `Throws TypeError when 1st arg. is undefined`)
  t.throws(() => { new XRangeError('100', 'message', 'file.js') }, TypeError, `Throws TypeError when 1st arg. is a String`)
  t.throws(() => { new XRangeError([], 'message', 'file.js') }, TypeError, `Throws TypeError when 1st arg. is an Array`)
  t.throws(() => { new XRangeError({}, 'message', 'file.js') }, TypeError, `Throws TypeError when 1st arg. is an Object`)
  t.throws(() => { new XRangeError(() => {}, 'message', 'file.js') }, TypeError, `Throws TypeError when 1st arg. is a Function`)
  t.throws(() => { new XRangeError(Promise.resolve(1), 'message', 'file.js') }, TypeError, `Throws TypeError when 1st arg. is a Promise`)
  t.throws(() => { new XRangeError(100, null, 'file.js') }, TypeError, `Throws TypeError when 2nd arg. is null`)
  t.throws(() => { new XRangeError(100, undefined, 'file.js') }, TypeError, `Throws TypeError when 2nd arg. is undefined`)
  t.throws(() => { new XRangeError(100, 100, 'file.js') }, TypeError, `Throws TypeError when 2nd arg. is a Number`)
  t.throws(() => { new XRangeError(100, [], 'file.js') }, TypeError, `Throws TypeError when 2nd arg. is an Array`)
  t.throws(() => { new XRangeError(100, {}, 'file.js') }, TypeError, `Throws TypeError when 2nd arg. is an Object`)
  t.throws(() => { new XRangeError(100, () => {}, 'file.js') }, TypeError, `Throws TypeError when 2nd arg. is a Function`)
  t.throws(() => { new XRangeError(100, Promise.resolve(1), 'file.js') }, TypeError, `Throws TypeError when 2nd arg. is a Promise`)
  t.throws(() => { new XRangeError(100, 'message', null) }, TypeError, `Throws TypeError when 3rd arg. is null`)
  t.throws(() => { new XRangeError(100, 'message', undefined) }, TypeError, `Throws TypeError when 3rd arg. is undefined`)
  t.throws(() => { new XRangeError(100, 'message', 100) }, TypeError, `Throws TypeError when 3rd arg. is a Number`)
  t.throws(() => { new XRangeError(100, 'message', []) }, TypeError, `Throws TypeError when 3rd arg. is an Array`)
  t.throws(() => { new XRangeError(100, 'message', {}) }, TypeError, `Throws TypeError when 3rd arg. is an Object`)

  t.throws(() => { new XRangeError(100, 'message', 'file.js', null) }, TypeError, `Throws TypeError when 4th arg. is null`)
  t.throws(() => { new XRangeError(100, 'message', 'file.js', undefined) }, TypeError, `Throws TypeError when 4th arg. is undefined`)
  t.throws(() => { new XRangeError(100, 'message', 'file.js', 100) }, TypeError, `Throws TypeError when 4th arg. is a Number`)
  t.throws(() => { new XRangeError(100, 'message', 'file.js', []) }, TypeError, `Throws TypeError when 4th arg. is an Array`)
  t.throws(() => { new XRangeError(100, 'message', 'file.js', {}) }, TypeError, `Throws TypeError when 4th arg. is an Object`)
  t.throws(() => { new XRangeError(100, 'message', 'file.js', 'xxx', 100) }, TypeError, `Throws TypeError when 4th arg. isn't one of string values 'enum', 'min', 'max', 'minmax'`)

  t.throws(() => { new XRangeError(100, 'message', 'file.js', 'enum', null) }, TypeError, `Throws TypeError when 5th arg. is null`)
  t.throws(() => { new XRangeError(100, 'message', 'file.js', 'enum', undefined) }, TypeError, `Throws TypeError when 5th arg. is undefined`)
  t.throws(() => { new XRangeError(100, 'message', 'file.js', 'enum', 100) }, TypeError, `Throws TypeError when 5th arg. is a Number and 4th arg. isn't set to 'min' or 'max'`)
  t.throws(() => { new XRangeError(100, 'message', 'file.js', 'min', [0, 100]) }, TypeError, `Throws TypeError when 5th arg. is an Array and 4th arg. isn't set to 'enum' or 'minmax'`)
  t.throws(() => { new XRangeError(100, 'message', 'file.js', 'enum', '100') }, TypeError, `Throws TypeError when 5th arg. is a String`)
  t.throws(() => { new XRangeError(100, 'message', 'file.js', 'enum', {}) }, TypeError, `Throws TypeError when 5th arg. is an Object`)
  t.throws(() => { new XRangeError(100, 'message', 'file.js', 'enum', []) }, TypeError, `Throws TypeError when 5th arg. is an empty Array`)

  t.throws(() => { new XRangeError(100, 'message', 'file.js', 'minmax', [100, '200']) }, TypeError, `1] Throws TypeError when 4th arg. is 'minmax' and not both values of array in 5th arg. are Numbers`)
  t.throws(() => { new XRangeError(100, 'message', 'file.js', 'minmax', ['100', 200]) }, TypeError, `2] Throws TypeError when 4th arg. is 'minmax' and not both values of array in 5th arg. are Numbers`)
  t.throws(() => { new XRangeError(100, 'message', 'file.js', 'minmax', [100]) }, TypeError, `Throws TypeError when 4th arg. is 'minmax' and array in 5th arg. only has one value`)
  t.throws(() => { new XRangeError(100, 'message', 'file.js', 'minmax', [100, 150, 200]) }, TypeError, `Throws TypeError when 4th arg. is 'minmax' and array in 5th arg. has 3 values`)

  t.throws(() => { new XRangeError(100, 'message', () => {}) }, TypeError, `Throws TypeError when 3rd arg. is a Function`)
  t.throws(() => { new XRangeError(100, 'message', Promise.resolve(1)) }, TypeError, `Throws TypeError when 3rd arg. is a Promise`)
  t.throws(() => { new XRangeError(-983, 'message', 'file.js') }, Error, `Throws Error when 1st arg. is given a Number of a non-existing code`)
  t.throws(() => { new XRangeError(100, 'OK', 'file.js') }, Error, `Throws Error when 2nd arg. is given a string less than 3 characters`)
  t.throws(() => { new XRangeError(100, 'message', '') }, Error, `Throws Error when 3rd arg. is given an empty string`)
  t.end()
})
