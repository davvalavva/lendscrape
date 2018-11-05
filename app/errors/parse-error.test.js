/* eslint-disable no-new */
/**
 * @file Tests for file {@link <install_folder>/errors/parse-error.js}
 * @copyright Copyright (C) David Jonsson - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * @author David Jonsson
 */

const { test } = require('tap')
const ParseError = require('./parse-error')

test('ParseError(message, fileName)', (t) => {
  t.type(new ParseError('message', 'file.js'), ParseError, `Returns instance of ParseError when thrown with correctly set arguments`)
  t.throws(() => { new ParseError() }, TypeError, `Throws TypeError when no arguments given`)
  t.throws(() => { new ParseError('message') }, TypeError, `Throws TypeError when 2nd argument not given`)
  t.throws(() => { new ParseError(null, 'file.js') }, TypeError, `Throws TypeError when 1st argument is null`)
  t.throws(() => { new ParseError(undefined, 'file.js') }, TypeError, `Throws TypeError when 1st argument is undefined`)
  t.throws(() => { new ParseError(301, 'file.js') }, TypeError, `Throws TypeError when 1st argument is a Number`)
  t.throws(() => { new ParseError([], 'file.js') }, TypeError, `Throws TypeError when 1st argument is an Array`)
  t.throws(() => { new ParseError({}, 'file.js') }, TypeError, `Throws TypeError when 1st argument is an Object`)
  t.throws(() => { new ParseError(() => {}, 'file.js') }, TypeError, `Throws TypeError when 1st argument is a Function`)
  t.throws(() => { new ParseError(Promise.resolve(1), 'file.js') }, TypeError, `Throws TypeError when 1st argument is a Promise`)
  t.throws(() => { new ParseError('', 'file.js') }, Error, `Throws Error when 1st argument is given an empty string`)
  t.throws(() => { new ParseError('message', null) }, TypeError, `Throws TypeError when 2nd argument is null`)
  t.throws(() => { new ParseError('message', undefined) }, TypeError, `Throws TypeError when 2nd argument is undefined`)
  t.throws(() => { new ParseError('message', 301) }, TypeError, `Throws TypeError when 2nd argument is a Number`)
  t.throws(() => { new ParseError('message', []) }, TypeError, `Throws TypeError when 2nd argument is an Array`)
  t.throws(() => { new ParseError('message', {}) }, TypeError, `Throws TypeError when 2nd argument is an Object`)
  t.throws(() => { new ParseError('message', () => {}) }, TypeError, `Throws TypeError when 2nd argument is a Function`)
  t.throws(() => { new ParseError('message', Promise.resolve(1)) }, TypeError, `Throws TypeError when 2nd argument is a Promise`)
  t.throws(() => { new ParseError('message', '') }, Error, `Throws Error when 2nd argument is given an empty string`)
  t.end()
})
